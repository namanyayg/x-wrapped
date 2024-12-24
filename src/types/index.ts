export interface Tweet {
  full_text: string;
  created_at: Date;
  retweet_count: number;
  favorite_count: number;
  reply_count: number;
  retweeted: boolean;
  views?: number;
  quotes?: number;
  bookmarks?: number;
  conversation_id?: string;
  media?: any;
  quoted?: any;
  retweeted_tweet?: any;
}

export interface User {
  username: string;
  screen_name?: string;
  name?: string | null;
  displayName?: string;
  description: string | null;
  followers_count: number;
  friends_count: number;
  profile_image_url: string;
  profile_image_url_https?: string;
  profile_banner_url: string;
  created_at: string;
  tweets?: Tweet[];
  stats?: Stats;
}

export interface Stats {
  total_tweets: number;
  total_retweets: number;
  total_favorites: number;
  total_replies: number;
  total_words: number;
  monthly_stats: {
    [key: string]: {
      tweet_count: number;
    };
  };
  best_tweet?: {
    text: string;
    likes: number;
    retweets: number;
    bookmarks: number;
  };
} 