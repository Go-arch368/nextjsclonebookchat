
"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Switch } from '@/ui/switch';
import { Input } from '@/ui/input';

const GlobalNotificationsHeader: React.FC = () => {
  const [isToggleChecked, setIsToggleChecked] = useState(true); // Main toggle default to "on"
  const [isLeadToggleChecked, setIsLeadToggleChecked] = useState(false); // Lead toggle default to "off"
  const [isServiceToggleChecked, setIsServiceToggleChecked] = useState(false); // Service toggle default to "off"

  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Global notification settings</h1>
        <Button
          className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
          onClick={() => console.log('Save clicked')}
        >
          Save
        </Button>
      </div>
      <hr className='mt-10'/>
      <div className="mt-4 flex items-center gap-2">
        <Switch
          checked={isToggleChecked}
          onCheckedChange={(checked) => {
            setIsToggleChecked(checked);
            console.log('Main toggle changed:', checked);
          }}
          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
        />
        <span className="text-sm text-gray-900">
          {isToggleChecked ? 'Use the same email for leads and service chat' : 'Use the same email for leads and service chat'}
        </span>
      </div>
      {isToggleChecked && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Notifications email</label>
            <Input
              type="email"
              placeholder="Enter email address"
              className="mt-2 w-full p-3 text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 mt-10">
            <Switch
              checked={isLeadToggleChecked}
              onCheckedChange={(checked) => {
                setIsLeadToggleChecked(checked);
                console.log('Lead notification toggle changed:', checked);
              }}
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
            />
            <span className="text-sm text-gray-900">Notify me when a lead is generated</span>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <Switch
              checked={isServiceToggleChecked}
              onCheckedChange={(checked) => {
                setIsServiceToggleChecked(checked);
                console.log('Service chat notification toggle changed:', checked);
              }}
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
            />
            <span className="text-sm text-gray-900">Notify me when a service chat is generated</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalNotificationsHeader;
