"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { CountUpAnimation } from './shared/CountUpAnimation';
import { getWordEquivalency, getEngagementEquivalency } from '../utils/equivalencies';
import { User, Stats } from '@/types';

interface UserData extends User {
  stats?: Stats;
}

interface SlideProps {
  user: UserData;
  slideIndex: number;
  isActive: boolean;
}

type StatDisplay = {
  label: string;
  value: number | string;
  suffix?: string;
};

const Header = ({ user }: { user: UserData }) => {
  return (
    <div className="text-center bg-black/50 px-8 py-4 rounded-2xl opacity-70 mb-2 absolute top-0 left-0 right-0">
      <h2 className="flex items-center justify-center">
        <img src={user.profile_image_url} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
        {user.name}&rsquo;s X Wrapped
      </h2>
    </div>
  );
};

const AnimatedText = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const Slide1 = ({ user }: { user: UserData }) => (
  <div className="space-y-8 h-[450px] flex flex-col justify-center">
    <Header user={user} />
    <div className="space-y-6 text-center">
      <AnimatedText>
        <p className="text-2xl mb-4">Hey {user.name} 👋</p>
      </AnimatedText>
      <AnimatedText>
        <p className="text-xl mb-4">Welcome to your X Wrapped!</p>
      </AnimatedText>
      <AnimatedText>
        <p className="text-lg mb-4">You used X a lot this year.</p>
      </AnimatedText>
      <AnimatedText>
        <div>
          <p className="text-6xl font-bold">
            <CountUpAnimation value={user.stats?.total_tweets || 0} />
          </p>
          <p className="text-2xl text-gray-400 mt-2">tweets made 🐦</p>
        </div>
      </AnimatedText>
    </div>
  </div>
);

const Slide2 = ({ user }: { user: UserData }) => (
  <div className="space-y-8 h-[450px] flex flex-col justify-center">
    <Header user={user} />
    <div className="space-y-6 text-center">
      <AnimatedText>
        <p className="text-2xl mb-4">Your {user.stats?.total_tweets} tweets contained</p>
      </AnimatedText>
      <AnimatedText>
        <div>
          <p className="text-6xl font-bold">
            <CountUpAnimation value={user.stats?.total_words || 0} /> 
          </p>
          <p className="text-2xl text-gray-400 mt-2">words ✍️</p>
        </div>
      </AnimatedText>
      <AnimatedText>
        <p className="text-xl">
          That's equivalent to {getWordEquivalency(user.stats?.total_words || 0)} 📚
        </p>
      </AnimatedText>
    </div>
  </div>
);

const Slide3 = ({ user }: { user: UserData }) => (
  <div className="space-y-8 h-[450px] flex flex-col justify-center">
    <Header user={user} />
    <div className="space-y-6">
      <AnimatedText>
        <p className="text-2xl mb-4 text-center">Your Best Tweet 🌟</p>
      </AnimatedText>
      <AnimatedText>
        <div>
          {user.stats?.best_tweet ? (
            <>
              <p className="mb-4">{user.stats.best_tweet.text}</p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold">
                    <CountUpAnimation value={user.stats.best_tweet.likes} />
                  </p>
                  <p className="text-gray-400">❤️ Likes</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    <CountUpAnimation value={user.stats.best_tweet.retweets} />
                  </p>
                  <p className="text-gray-400">🔄 Retweets</p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xl text-center text-gray-400">No tweet data available</p>
          )}
        </div>
      </AnimatedText>
    </div>
  </div>
);

const Slide4 = ({ user }: { user: UserData }) => (
  <div className="space-y-8 h-[450px] flex flex-col justify-center">
    <Header user={user} />
    <div className="space-y-6 text-center">
      <AnimatedText>
        <p className="text-2xl mb-4">Your tweets got a total of</p>
      </AnimatedText>
      <AnimatedText>
        <div>
          <p className="text-6xl font-bold">
            <CountUpAnimation value={user.stats?.total_replies || 0} />
          </p>
          <p className="text-2xl text-gray-400 mt-2">replies 💬</p>
        </div>
      </AnimatedText>
      <AnimatedText>
        <p className="text-xl">
          That's the same as {getEngagementEquivalency(user.stats?.total_replies || 0)}!
        </p>
      </AnimatedText>
    </div>
  </div>
);

const Slide5 = ({ user }: { user: UserData }) => {
  const bestMonth = useMemo(() => {
    if (!user.stats?.monthly_stats || Object.keys(user.stats.monthly_stats).length === 0) {
      return { month: 'January', count: 0 };
    }
    
    const [bestMonthKey, bestMonthStats] = Object.entries(user.stats.monthly_stats)
      .reduce((best, current) => 
        current[1].tweet_count > best[1].tweet_count ? current : best
      );

    return {
      month: new Date(bestMonthKey).toLocaleString('default', { month: 'long' }),
      count: bestMonthStats.tweet_count
    };
  }, [user.stats?.monthly_stats]);

  return (
    <div className="space-y-8 h-[450px] flex flex-col justify-center">
      <Header user={user} />
      <div className="space-y-6 text-center">
        <AnimatedText>
          <p className="text-2xl mb-4">Your Most Active Month 📅</p>
        </AnimatedText>
        <AnimatedText>
          <p className="text-2xl">{bestMonth.month}</p>
        </AnimatedText>
        <AnimatedText>
          <div>
            <p className="text-4xl font-bold mb-4 -mt-4">
              <CountUpAnimation value={bestMonth.count} />
            </p>
            <p className="text-2xl text-gray-400 mt-2">tweets this month 🚀</p>
          </div>
        </AnimatedText>
      </div>
    </div>
  );
};

const Slide6 = ({ user }: { user: UserData }) => (
  <div className="space-y-8 h-[450px] flex flex-col justify-center">
    <Header user={user} />
    <div className="space-y-6">
      <AnimatedText>
        <p className="text-2xl mb-4 text-center">Here&rsquo;s to a great 2024! 🎉</p>
        <p className="text-xl mb-8 text-center">What will the next year bring for you?</p>
      </AnimatedText>
      <div className="grid grid-cols-2 gap-6">
        <AnimatedText>
          <div className="text-center">
            <p className="text-4xl font-bold">
              <CountUpAnimation value={user.stats?.total_tweets || 0} />
            </p>
            <p className="text-gray-400">Tweets 🐦</p>
          </div>
        </AnimatedText>
        <AnimatedText>
          <div className="text-center">
            <p className="text-4xl font-bold">
              <CountUpAnimation value={user.stats?.total_favorites || 0} />
            </p>
            <p className="text-gray-400">Likes ❤️</p>
          </div>
        </AnimatedText>
        <AnimatedText>
          <div className="text-center">
            <p className="text-4xl font-bold">
              <CountUpAnimation value={user.stats?.total_replies || 0} />
            </p>
            <p className="text-gray-400">Replies 💬</p>
          </div>
        </AnimatedText>
        <AnimatedText>
          <div className="text-center">
            <p className="text-4xl font-bold">
              <CountUpAnimation value={user.stats?.total_retweets || 0} />
            </p>
            <p className="text-gray-400">Retweets 🔄</p>
          </div>
        </AnimatedText>
      </div>
    </div>
  </div>
);

const Slide = ({ user, slideIndex, isActive }: SlideProps) => {
  const getShareText = () => {
    switch (slideIndex) {
      case 0:
        return `My 2024 X Wrapped is here! 🎉\n\nI shared my thoughts in ${user.stats?.total_tweets} tweets this year 📊\n\nGet yours at x.nmn.gl 🔗`;
      case 1:
        return `My year on X in words ✍️\n\n${user.stats?.total_words} words written ✨\nThat's like ${getWordEquivalency(user.stats?.total_words || 0)} 📚\n\nx.nmn.gl 🔗`;
      case 2:
        return `My best tweet of 2024 ⭐️\n\n${user.stats?.best_tweet?.likes} likes ❤️\n${user.stats?.best_tweet?.retweets} retweets 🔄\n\nSee your top moments at x.nmn.gl 🔗`;
      case 3:
        return `Engagement check on X 💫\n\n${user.stats?.total_replies} people joined the conversation 💬\nThat's like ${getEngagementEquivalency(user.stats?.total_replies || 0)} 🤯\n\nx.nmn.gl 🔗`;
      case 4:
        const bestMonth = Object.entries(user.stats?.monthly_stats || {}).reduce((max, [month, stats]) => 
          stats.tweet_count > (max[1]?.tweet_count || 0) ? [month, stats] : max
        , ['', { tweet_count: 0 }]);
        return `Peak Twitter Energy 🌟\n\n${new Date(bestMonth[0]).toLocaleString('default', { month: 'long' })} was my power month 📅\n${bestMonth[1].tweet_count} tweets in 30 days 📈\n\nx.nmn.gl 🔗`;
      case 5:
        return `My 2024 X Year in Review 🎊\n\n${user.stats?.total_tweets} tweets 🐦\n${user.stats?.total_favorites} likes ❤️\n${user.stats?.total_replies} replies 💬\n${user.stats?.total_retweets} retweets 🔄\n\nx.nmn.gl 🔗`;
      default:
        return `Check out my X Wrapped! ✨\n\nx.nmn.gl 🔗`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 100 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="absolute w-full"
    >
      <div id={`slide-${slideIndex}`} className="text-white shadow-blue-500/50 shadow-2xl relative before:absolute before:-inset-1 before:rounded-[19px] before:p-[4px] before:bg-gradient-to-r before:from-blue-200 before:via-blue-500 before:to-blue-200">
        <div className="relative z-10 bg-black bg-gradient-to-b from-blue-950 to-black p-8 rounded-2xl">
          {slideIndex === 0 ? <Slide1 user={user} /> : slideIndex === 1 ? <Slide2 user={user} /> : slideIndex === 2 ? <Slide3 user={user} /> : slideIndex === 3 ? <Slide4 user={user} /> : slideIndex === 4 ? <Slide5 user={user} /> : <Slide6 user={user} />}
          <ShareButton 
            slideIndex={slideIndex} 
            getShareText={getShareText}
            user={user}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ShareButton = ({ slideIndex, getShareText, user }: { slideIndex: number, getShareText: () => string, user: UserData }) => {
  const handleTwitterShare = () => {
    const twitterText = getShareText();
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleWebShare = async () => {
    if (!navigator.share) return;
    
    try {
      await navigator.share({
        title: 'X Wrapped',
        text: getShareText(),
        url: 'https://x.nmn.gl'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="flex justify-center mt-4 space-x-4">
      {typeof navigator === 'undefined' || !navigator.share ? (
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-lg"
          onClick={handleTwitterShare}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share on X</span>
        </button>
      ) : (
        <button
          className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-lg"
          onClick={handleWebShare}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share</span>
        </button>
      )}
    </div>
  );
};

export default function AnalysisClientSide({ user }: { user: UserData }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;

  const slides = [
    <Slide1 key={0} user={user} />,
    <Slide2 key={1} user={user} />,
    <Slide3 key={2} user={user} />,
    <Slide4 key={3} user={user} />,
    <Slide5 key={4} user={user} />,
    <Slide6 key={5} user={user} />,
  ];

  return (
    <div className="relative py-8 mx-auto px-2 w-full">
      <div className="relative h-[600px]">
        <AnimatePresence mode="wait">
          <Slide 
            key={currentSlide}
            user={user}
            slideIndex={currentSlide}
            isActive={true}
          />
        </AnimatePresence>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

