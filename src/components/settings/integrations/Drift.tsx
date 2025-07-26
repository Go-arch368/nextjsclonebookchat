
"use client";

import React, { useState } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { ChevronDown } from 'lucide-react';

const Drift: React.FC = () => {
  const [inputValue, setInputValue] = useState('Drift');
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
              placeholder="Drift"
            />
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {isOpen && (
            <div className="mt-12 p-6 bg-sky-300 shadow-lg rounded-lg text-center">
              <p>Integration is not configured</p>
              <p>It looks like Drift is not integrated with Your customer account.</p>
              <p>
                Click{' '}
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  onClick={() => console.log("Configure clicked")}
                >
                  Configure
                </button>{' '}
                to set up integration
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drift;
