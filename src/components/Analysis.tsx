"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
// import Leaderboard from "@/components/Leaderboard";

interface UserData {
  username: string;
  screen_name: string;
  name: string;
  displayName: string;
  description: string | null;
  followers_count: number;
  friends_count: number;
  profile_image_url: string;
  profile_image_url_https: string;
  profile_banner_url: string;
  created_at: string;
  stats?: {
    total_tweets: number;
    total_favorites: number;
    total_retweets: number;
    total_replies: number;
    total_words: number;
  };
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
    <div className="text-center">
      <h2 className="text-2xl mb-2 flex items-center justify-center">
        <img src={user.profile_image_url} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
        {user.name}&rsquo;s X Wrapped
      </h2>
    </div>
  );
};

const Slide1 = ({ user }: { user: UserData }) => {
  return (
    <div className="space-y-8">
      <Header user={user} />
      <div className="space-y-6 text-center">
        <div>
          <p className="text-6xl font-bold">{user.stats?.total_tweets?.toLocaleString()}</p>
          <p className="text-2xl text-gray-400 mt-2">tweets</p>
        </div>
        <div>
          <p className="text-6xl font-bold">{user.stats?.total_words?.toLocaleString()}</p>
          <p className="text-2xl text-gray-400 mt-2">words written</p>
        </div>
      </div>
    </div>
  );
};

const Slide2 = ({ user }: { user: UserData }) => {
  return (
    <div className="space-y-8">
      <Header user={user} />
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-2xl mb-2">Total Engagement</p>
          <p className="text-6xl font-bold">
            {((user.stats?.total_favorites || 0) + (user.stats?.total_retweets || 0)).toLocaleString()}
          </p>
        </div>
        
        <div>
          <p className="text-2xl text-gray-400 mb-4">Breakdown</p>
          <ol className="space-y-3">
            <li className="text-xl">❤️ {user.stats?.total_favorites?.toLocaleString()} Likes</li>
            <li className="text-xl">🔄 {user.stats?.total_retweets?.toLocaleString()} Retweets</li>
            <li className="text-xl">💬 {user.stats?.total_replies?.toLocaleString()} Replies</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

const Slide = ({ user, slideIndex, isActive }: SlideProps) => {
  const getShareText = () => {
    if (slideIndex === 0) {
      return `in 2024, i tweeted ${user.stats?.total_tweets?.toLocaleString()} times using ${user.stats?.total_words?.toLocaleString()} words 🤯\n\nget your X wrapped at x.nmn.gl`;
    }
    return `my X wrapped 2024:\n📊 ${user.stats?.total_tweets?.toLocaleString()} tweets\n❤️ ${(user.stats?.total_favorites || 0).toLocaleString()} likes\n🔄 ${(user.stats?.total_retweets || 0).toLocaleString()} retweets\n\nsee yours at x.nmn.gl`;
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
          {slideIndex === 0 ? <Slide1 user={user} /> : <Slide2 user={user} />}
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
  const generateImage = async () => {
    const element = document.getElementById(`slide-${slideIndex}`);
    if (!element) return null;

    // Temporarily hide the share buttons
    const shareButtons = element.querySelectorAll('button');
    shareButtons.forEach(button => button.style.display = 'none');

    // Add credit byline
    const creditLine = document.createElement('p');
    creditLine.textContent = 'See your X Wrapped at https://x.nmn.gl/';
    creditLine.style.fontSize = '12px';
    creditLine.style.textAlign = 'center';
    creditLine.style.marginTop = '10px';
    element.appendChild(creditLine);

    const canvas = await html2canvas(element);

    // Restore the share buttons visibility
    shareButtons.forEach(button => button.style.display = '');

    // Remove the credit line after capturing
    element.removeChild(creditLine);

    return canvas.toDataURL('image/png');
  };

  const handleTwitterShare = () => {
    const twitterText = getShareText();
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleWebShare = async () => {
    if (!navigator.share) return;
    
    const imageUrl = await generateImage();
    if (imageUrl) {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], 'analysis.png', { type: 'image/png' });
      try {
        await navigator.share({
          title: 'X Wrapped',
          text: getShareText(),
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="flex justify-center mt-4 space-x-4">
      <button
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-lg"
        onClick={handleTwitterShare}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>Share on X</span>
      </button>
      {/* @ts-ignore */}
      {typeof navigator !== 'undefined' && navigator.share && (
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
  const totalSlides = 2;

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

