"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
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

const ShareButton = () => {
  const generateImage = async () => {
    const element = document.getElementById('roast-content');
    if (!element) return null;

    // Temporarily hide the share buttons
    const shareButtons = element.querySelectorAll('button');
    shareButtons.forEach(button => button.style.display = 'none');

    // Add credit byline
    const creditLine = document.createElement('p');
    creditLine.textContent = 'Analyzed by https://xtype.nmn.gl/';
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
    const twitterText = `so apparently my X persona (according to John Rush) is "${user.screen_name}" 🤦‍♂️\n\nfind out yours now 👇 https://xtype.nmn.gl/`;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleWebShare = async () => {
    const imageUrl = await generateImage();
    if (imageUrl && navigator.share) {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], 'analysis.png', { type: 'image/png' });
      try {
        await navigator.share({
          title: 'X Persona Analysis',
          text: `so apparently my X persona (according to John Rush) is "${persona}" 🤦‍♂️\n\nfind out yours now 👇 https://xtype.nmn.gl/`,
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
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center space-x-2 shadow-lg"
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

const Loader = () => {
  const loadingTexts = useMemo(() => [
    "Pulling up your profile",
    "Analyzing stats",
  ], []);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [loadingTexts]);

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-blue-500`}></div>
      <p className={`mt-8 text-xl text-blue-600`}>{loadingTexts[currentTextIndex]}...</p>
    </div>
  );
};

export default function AnalysisClientSide({ user }: { user: UserData }) {
  const router = useRouter();
  const username = user.screen_name?.toLowerCase() || user.username?.toLowerCase();

  return (
    <>
      <div className="relative py-8 max-w-md mx-auto px-2">
        <div id="roast-content" className="bg-black text-white rounded-2xl shadow-xl p-8 border border-gray-800">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 flex items-center justify-center">
                <img src={user.profile_image_url} alt={user.name} className="w-12 h-12 rounded-full mr-2" />
                {user.name}&rsquo;s X Wrapped
              </h2>
              <h3 className="text-3xl text-blue-400 -m-2">2024</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-gray-400">Total Tweets</p>
                <p className="text-4xl font-bold">{user.stats?.total_tweets}</p>
              </div>

              <div>
                <p className="text-gray-400">Total Engagement</p>
                <p className="text-4xl font-bold">{(user.stats?.total_favorites || 0) + (user.stats?.total_retweets || 0)}</p>
              </div>

              <div>
                <p className="text-gray-400">Words Written</p>
                <p className="text-4xl font-bold">{user.stats?.total_words}</p>
              </div>

              <div>
                <p className="text-gray-400">Top Metrics</p>
                <ol className="mt-2 space-y-1">
                  <li>1. {user.stats?.total_favorites || 0} Likes</li>
                  <li>2. {user.stats?.total_retweets || 0} Retweets</li>
                  <li>3. {user.stats?.total_replies || 0} Replies</li>
                </ol>
              </div>
            </div>
          </div>
          <ShareButton />
        </div>
      </div>
      {/* <Leaderboard /> */}
    </>
  );
}

