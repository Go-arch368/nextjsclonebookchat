"use client";

import React, { useState } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { ChevronDown } from 'lucide-react';

const OpenAiChatBots: React.FC = () => {
  const [inputValue, setInputValue] = useState('OpenAI Chat Bots');
  const [isOpen, setIsOpen] = useState(false);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="mt-5 max-w-xl mx-auto">
      <div className="space-y-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              className="w-full border bg-sky-300 text-black font-bold border-gray-300 hover:bg-white focus:ring-2 focus:ring-blue-500 p-4 pr-10 cursor-pointer"
              placeholder="OpenAI Chat Bots"
            />
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {isOpen && (
            <div className="mt-4 p-6 bg-green-100 shadow-lg rounded-lg space-y-4 text-center">
              <p className="text-black font-medium">
                Integration has been configured.
              </p>

              <p className="text-sm text-gray-800">
                Click{' '}
                <button
                  className="inline-block bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  onClick={() => console.log("Reconfigure clicked")}
                >
                  Reconfigure
                </button>{' '}
                to set up integration with another configuration.
              </p>

              <p className="text-sm text-gray-800">
                If you would like to stop integration, then click{' '}
                <button
                  className="inline-block bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  onClick={() => console.log("Remove clicked")}
                >
                  Remove
                </button>{' '}
                to remove your saved configuration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenAiChatBots;
