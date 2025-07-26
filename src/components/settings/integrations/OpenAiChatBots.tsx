
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
    <div className="mt-5">
      <div className="space-y-6">
        <div className="p-4 rounded-lg">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              className="w-full border bg-sky-300 text-black font-bold border-gray-300 hover:bg-white focus:ring-2 focus:ring-blue-500 p-6 pr-10 cursor-pointer"
              placeholder="OpenAI Chat Bots"
            />
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {isOpen && (
            <div className="mt-2 p-6 bg-green-100 shadow-lg rounded-lg text-center">
              <p>Integration has been configured</p>
              <p>OpenAI API key: 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</p>
              <p>
                Click{' '}
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  onClick={() => console.log("Reconfigure clicked")}
                >
                  Reconfigure
                </button>{' '}
                to set up integration with another configuration.
              </p>
              <p>
                If You would like to stop integration, then click{' '}
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  onClick={() => console.log("Remove clicked")}
                >
                  Remove
                </button>{' '}
                to remove Your saved configuration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenAiChatBots;
