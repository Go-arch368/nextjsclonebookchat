
"use client";

import React, { useState } from 'react';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';

const InactivityTimeoutsHeader: React.FC = () => {
  const [isCheckedAgent, setIsCheckedAgent] = useState(false);
  const [isCheckedArchive, setIsCheckedArchive] = useState(false);
  const [visitorMinutes, setVisitorMinutes] = useState('2');
  const [visitorSeconds, setVisitorSeconds] = useState('0');
  const [message, setMessage] = useState('Please respond in $time');

  // Generate options for minutes and seconds (0 to 59)
  const timeOptions = Array.from({ length: 60 }, (_, i) => i.toString());

  // Determine if Save button is enabled
  const isSaveEnabled = isCheckedAgent || isCheckedArchive;

  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Inactivity Timeouts</h1>
        <hr className="border-gray-300" />
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {/* First Configuration: Agent not responding */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="agent-checkbox"
              checked={isCheckedAgent}
              onCheckedChange={(checked) => setIsCheckedAgent(!!checked)}
              className="h-4 w-4 text-blue-500"
            />
            <Label htmlFor="agent-checkbox" className="text-sm font-medium text-gray-700">
              When the agent is not responding for
            </Label>
          </div>
          <Select disabled={!isCheckedAgent}>
            <SelectTrigger className="w-[80px] border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="0" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {timeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">minutes</span>
          <Select disabled={!isCheckedAgent}>
            <SelectTrigger className="w-[80px] border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="0" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {timeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">
            seconds, transfer the visitor to another agent. Applies only if the chat has just started. All following responses can be longer and won't result in a transfer
          </span>
        </div>
        {/* Second Configuration: No new messages */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="archive-checkbox"
              checked={isCheckedArchive}
              onCheckedChange={(checked) => setIsCheckedArchive(!!checked)}
              className="h-4 w-4 text-blue-500"
            />
            <Label htmlFor="archive-checkbox" className="text-sm font-medium text-gray-700">
              When there are no new messages in the chat for
            </Label>
          </div>
          <Select disabled={!isCheckedArchive}>
            <SelectTrigger className="w-[80px] border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="0" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {timeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">minutes</span>
          <Select disabled={!isCheckedArchive}>
            <SelectTrigger className="w-[80px] border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="0" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {timeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">seconds, archive the chat.</span>
        </div>
        {/* Third Configuration: No new messages from visitor */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            When there are no new messages from the visitor for
          </span>
          <Select
            value={visitorMinutes}
            onValueChange={setVisitorMinutes}
          >
            <SelectTrigger className="w-[80px] border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="2" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {timeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">minutes</span>
          <Select
            value={visitorSeconds}
            onValueChange={setVisitorSeconds}
          >
            <SelectTrigger className="w-[80px] border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="0" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {timeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">
            seconds after agent responded, put him back in the queue.
          </span>
        </div>
        {/* New Section: Timeout Message */}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700">
            When agent responded send message about timeout to visitor:
          </Label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Please respond in $time"
          />
          <span className="text-xs text-gray-500">
            Put $time variable to include countdown timer.
          </span>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              isSaveEnabled
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isSaveEnabled}
            onClick={() => console.log('Save clicked', { isCheckedAgent, isCheckedArchive, visitorMinutes, visitorSeconds, message })}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InactivityTimeoutsHeader;
