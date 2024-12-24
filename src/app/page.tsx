"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from 'lucide-react';

import Leaderboard from "@/components/Leaderboard";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value.replace("@", "");
    if (!username) {
      return;
    }
    router.push(`/u/${username}`);
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="pt-40 pb-20 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Main Heading with Animation */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-600 transition-all duration-300">
              Unlock Your X DNA
            </h1>
            <p className="text-xl text-gray-600">
              Enter your username and discover your true online persona
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
              Reveal My Persona
            </button>
          </form>
        </div>
      </div>

      <Leaderboard />
    </main>
  );
}
