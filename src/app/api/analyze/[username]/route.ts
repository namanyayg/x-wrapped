import fs from 'fs'
import { revalidatePath } from 'next/cache'
import prisma from '@/app/lib/prisma'
import { fetchUserWithTweets } from '@/app/lib/twitter-api'
import { User, Tweet, Stats } from '@/types'

export const maxDuration = 60

const getOrFetchUser = async (username: string) => {
  console.log('ROUTE API Fetching user', username)
  // if a user already exists in the database, return it
  const userInDb = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      tweets: true,
    },
  })
  console.log('ROUTE API User found in db', userInDb?.username)
  if (userInDb) {
    // Check if user was created after Dec 20th
    const updatedAt = new Date(userInDb.updatedAt);
    const dec20th = new Date('2023-12-20');
    if (updatedAt > dec20th) {
      // @ts-ignore
      userInDb.profile_image_url = userInDb.profile_image_url || userInDb.profile_image_url_https
      // @ts-ignore
      userInDb.profile_image_url = userInDb.profile_image_url?.replace('_normal', '_400x400')
      return userInDb;
    }
  }
  // otherwise, fetch it and save it to the database
  let userData, raw
  // @ts-ignore
  const { user, raw: rawData } = await fetchUserWithTweets(username);
  userData = user
  raw = rawData
  if (!userData) {
    console.error('No user data found')
    return null;
  }
  const userToSave = {
    username: userData.screen_name.toLowerCase(),
    name: userData.name,
    description: userData.description,
    created_at: userData.created_at ? new Date(userData.created_at) : new Date(),
    followers_count: userData.followers_count,
    friends_count: userData.friends_count,
    profile_image_url: userData.profile_image_url || userData.profile_image_url_https,
    profile_banner_url: userData.profile_banner_url,
    statuses_count: userData.statuses_count,
    tweets: {
      create: userData.tweets.map((t: any) => ({
        full_text: t.full_text,
        created_at: t.created_at ? new Date(t.created_at) : new Date(),
        retweet_count: t.retweet_count,
        favorite_count: t.favorite_count,
        reply_count: t.reply_count,
        retweeted: t.retweeted,
      })),
    }
  }
  // save the user to the database
  await prisma.user.upsert({
    where: {
      username: userData.screen_name.toLowerCase(),
    },
    update: userToSave,
    create: userToSave,
    include: {
      tweets: true,
    },
  })
  // Now fetch and return the user from db
  const userFromDb = await prisma.user.findUnique({
    where: {
      username: username.toLowerCase(),
    },
    include: {
      tweets: true,
    },
  })
  return userFromDb
}

/**
 * Get the user's yearly stats by summing up data for all tweets
 * done in the year 2024
 * @param userData 
 * @returns 
 */
const getUserYearlyStats = async (userData: User & { tweets: Tweet[] }): Promise<Stats> => {
  const stats: Stats = {
    total_tweets: 0,
    total_retweets: 0,
    total_favorites: 0,
    total_replies: 0,
    total_words: 0,
    monthly_stats: {},
  }

  let bestTweet: Tweet | null = null;
  let bestTweetScore = -1;

  for (const tweet of userData.tweets || []) {
    // Basic stats
    stats.total_tweets += 1
    stats.total_retweets += tweet.retweet_count || 0
    stats.total_favorites += tweet.favorite_count || 0
    stats.total_replies += tweet.reply_count || 0
    stats.total_words += tweet.full_text?.split(' ').length || 0

    // Monthly stats
    const date = new Date(tweet.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!stats.monthly_stats[monthKey]) {
      stats.monthly_stats[monthKey] = { tweet_count: 0 }
    }
    stats.monthly_stats[monthKey].tweet_count++

    // Best tweet calculation
    const tweetScore = (tweet.favorite_count || 0) + 
                      (tweet.retweet_count || 0) * 2 + 
                      (tweet.bookmarks || 0) * 3;
    if (tweetScore > bestTweetScore) {
      bestTweetScore = tweetScore;
      bestTweet = tweet;
    }
  }

  // Add best tweet to stats if found
  if (bestTweet) {
    stats.best_tweet = {
      text: bestTweet.full_text,
      likes: bestTweet.favorite_count || 0,
      retweets: bestTweet.retweet_count || 0,
      bookmarks: bestTweet.bookmarks || 0
    };
  }

  return stats
}

export async function GET(req: Request, { params }: { params: { username: string } }) {
  const username = params.username.toLowerCase();
  console.log('ANALYZE ROUTE Fetching user data for', username)
  
  if (username === 'installhook.js.map') {
    return Response.json({ error: 'User not found' });
  }
  
  const user = await getOrFetchUser(username);
  if (!user) {
    return Response.json({ error: 'User not found' });
  }
  
  const stats = await getUserYearlyStats(user);
  const processedUser = {
    ...user,
    stats
  };
  
  return Response.json(processedUser);
}