"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from 'lucide-react';

import Leaderboard from "@/components/Leaderboard";

const getUserData = async (username: string) => {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://x.nmn.gl';

  try {
    const apiUrl = `${baseUrl}/api/analyze/${username}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const Loader = () => {
  const loadingTexts = useMemo(() => [
    "Pulling up your profile",
    "Analyzing stats",
    "Crunching numbers",
    "Almost there"
  ], []);
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [loadingTexts]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-blue-500"></div>
      <p className="mt-8 text-xl text-blue-600">
        {loadingTexts[currentTextIndex]}...
      </p>
    </div>
  );
};

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value.replace("@", "");
    if (!username) return;

    setIsLoading(true);
    try {
      const userData = await getUserData(username);
      if (userData) {
        router.push(`/u/${username}`);
      } else {
        // You might want to show an error message here
        console.error('No user data found');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-white w-full">
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="max-w-3xl w-full text-center space-y-8">
            {/* Main Heading with Animation */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-blue-600 transition-all duration-300">
                Review Your Year on X
              </h1>
              <p className="text-xl text-gray-600">
                Enter your username and see your X journey in 2024
              </p>
            </div>

            {/* Input Section */}
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
              <div className="relative">
                <input
                  ref={usernameRef}
                  type="text"
                  placeholder="Enter your X username"
                  className="text-gray-800 w-full px-6 py-4 rounded-full border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-lg pr-12"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                  bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full
                  transform transition-all duration-300 ${isHovered ? 'scale-105' : ''}
                  shadow-lg hover:shadow-xl
                `}
              >
                Get My X Wrapped
              </button>
            </form>
          </div>
        )}
      </div>

      <Leaderboard />
    </main>
  );
}
