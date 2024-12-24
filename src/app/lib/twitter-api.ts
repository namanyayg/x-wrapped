/**
 * Simplifying access to the Twitter API
 * using third party APIs
 * and cleaning up the output
 */
import fs from 'fs';
import dotenv from 'dotenv/config';

const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY

const _makeRapidApiRequest = async (endpoint: string, method = 'GET') => {
  const url = `https://${RAPIDAPI_HOST}/${endpoint}`;
  const options = {
    method: method,
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    }
  };
  try {
    // @ts-ignore
    const response = await fetch(url, options)
    const result = await response.json()
    return result
  } catch (error) {
    console.error(error);
  }
}

const fetchUserInfo = async (username: string) => {
  const endpoint = `user/details?username=${username}`
  const result = await _makeRapidApiRequest(endpoint)
  return result.data.user.result.legacy
}

/**
 * Fetches user timeline and details with pagination
 * Stops after reaching 2023 tweets or 40 pages
 */
const fetchUserTimeline = async (username: string) => {
  let allTweets = []
  let cursor = ''
  let pageCount = 0
  const currentYear = new Date().getFullYear()
  let raw: any
  
  while (pageCount < 40) {
    const endpoint = cursor 
      ? `timeline.php?screenname=${username}&cursor=${cursor}`
      : `timeline.php?screenname=${username}`
    raw = await _makeRapidApiRequest(endpoint)
    
    if (!raw?.timeline || raw.status !== 'ok') {
      console.error('Invalid response format or error', raw)
      break
    }

    // Get tweets from this page
    const tweets = raw.timeline.filter((tweet: any) => {
      const tweetYear = new Date(tweet.created_at).getFullYear()
      return tweetYear >= currentYear
    })

    // Stop if we've reached older tweets
    if (tweets.length < raw.timeline.length) {
      allTweets.push(...tweets)
      break
    }

    allTweets.push(...raw.timeline)
    
    if (!raw.next_cursor) break
    cursor = raw.next_cursor
    pageCount++
  }

  return {
    user: raw?.user,
    timeline: allTweets
  }
}

/**
 * Fetch user with tweets and clean up the response to match existing schema
 */
const fetchUserWithTweets = async (username: string) => {
  const raw = await fetchUserTimeline(username)
  if (!raw || !raw.user) {
    console.error('User not found or has no tweets ' + username)
    return false
  }

  try {
    // Clean up user object to match existing schema
    const user = {
      screen_name: raw.user.profile.toLowerCase(),
      name: raw.user.name,
      description: raw.user.desc,
      created_at: raw.user.created_at,
      followers_count: raw.user.sub_count,
      friends_count: raw.user.friends,
      profile_image_url: raw.user.avatar,
      profile_banner_url: raw.user.header_image,
      statuses_count: raw.user.statuses_count,
      tweets: raw.timeline.map(tweet => ({
        full_text: tweet.text,
        created_at: tweet.created_at,
        retweet_count: tweet.retweets,
        favorite_count: tweet.favorites,
        reply_count: tweet.replies,
        retweeted: tweet.retweeted_tweet ? true : false,
        // Additional fields that might be useful
        views: tweet.views,
        quotes: tweet.quotes,
        bookmarks: tweet.bookmarks,
        conversation_id: tweet.conversation_id,
        media: tweet.media || null,
        quoted: tweet.quoted || null,
        retweeted_tweet: tweet.retweeted_tweet || null
      }))
    }
    return { user, raw }
  } catch (e) {
    console.error(e)
    console.log('ERRORED FOR ', username)
    throw new Error('Fatal Error Occurred')
  }
}

export {
  fetchUserInfo,
  fetchUserTimeline,
  fetchUserWithTweets
}
