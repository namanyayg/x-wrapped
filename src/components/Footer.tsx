'use client'
import React from 'react';
export default function Footer() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Footer with Modal Trigger */}
      <footer className="py-12 bg-blue-50 text-center">
        <button 
          onClick={openModal}
          className="border-b-2 border-blue-600 text-gray-600 hover:text-blue-600 transition-colors"
        >
          Made with ❤️ & ⚡by nmn
        </button>
      </footer>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div 
            className="bg-white p-8 max-w-2xl mx-auto rounded-lg relative animate-fadeIn"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            
            <div className="text-gray-600">
              <a className="flex items-center justify-center mb-6" href="https://x.com/NamanyayG" target="_blank" rel="noopener noreferrer">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                  <img src="https://pbs.twimg.com/profile_images/1808192564257841152/6S6mwLb4_400x400.jpg" alt="NamanyayG" width={48} height={48} />
                </div>
                <h2 className="text-2xl font-semibold text-blue-600">Hi, I&rsquo;m nmn</h2>
              </a>
              <p className="text-lg mb-4">I started my X journey in 2024, and I&rsquo;m glad to have made many friends and learn a lot of new things.</p>
              <p className="text-lg mb-4">I wanted to reflect on my X journey so far, and this is my way of giving back to the community.</p>
              <p className="text-lg mb-4">I talk about AI, startups, life, & more, and <a href="https://x.com/NamanyayG" target="_blank" rel="noopener noreferrer" className="font-bold underline">I would love to earn your follow</a></p>
              <div className="flex justify-center">
                <a 
                  href="https://x.com/NamanyayG" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-full transition duration-300"
                >
                  My X Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}