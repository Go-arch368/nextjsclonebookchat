"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface InactivityTimeout {
  id?: number;
  userId: number;
  agentNotRespondingEnabled: boolean;
  agentNotRespondingMinutes: number;
  agentNotRespondingSeconds: number;
  archiveChatEnabled: boolean;
  archiveChatMinutes: number;
  archiveChatSeconds: number;
  visitorInactivityMinutes: number;
  visitorInactivitySeconds: number;
  timeoutMessage: string;
  createdAt: string;
  updatedAt: string;
}

const InactivityTimeoutsHeader: React.FC = () => {
  const [isCheckedAgent, setIsCheckedAgent] = useState(false);
  const [isCheckedArchive, setIsCheckedArchive] = useState(false);
  const [agentMinutes, setAgentMinutes] = useState('0');
  const [agentSeconds, setAgentSeconds] = useState('0');
  const [archiveMinutes, setArchiveMinutes] = useState('0');
  const [archiveSeconds, setArchiveSeconds] = useState('0');
  const [visitorMinutes, setVisitorMinutes] = useState('2');
  const [visitorSeconds, setVisitorSeconds] = useState('0');
  const [message, setMessage] = useState('Please respond in $time');
  const [currentSettingId, setCurrentSettingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate options for minutes and seconds (0 to 59)
  const timeOptions = Array.from({ length: 60 }, (_, i) => i.toString());

  // Fetch all inactivity timeout settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get<InactivityTimeout[]>('https://zotly.onrender.com/api/v1/settings/inactivity-timeouts');
        const settings = response.data;

        // Sort by createdAt (descending) to get the most recent setting
        if (settings.length > 0) {
          const latestSetting = settings.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

          // Update state with the latest setting
          setCurrentSettingId(latestSetting.id || null);
          setIsCheckedAgent(latestSetting.agentNotRespondingEnabled);
          setIsCheckedArchive(latestSetting.archiveChatEnabled);
          setAgentMinutes(latestSetting.agentNotRespondingMinutes.toString());
          setAgentSeconds(latestSetting.agentNotRespondingSeconds.toString());
          setArchiveMinutes(latestSetting.archiveChatMinutes.toString());
          setArchiveSeconds(latestSetting.archiveChatSeconds.toString());
          setVisitorMinutes(latestSetting.visitorInactivityMinutes.toString());
          setVisitorSeconds(latestSetting.visitorInactivitySeconds.toString());
          setMessage(latestSetting.timeoutMessage);
        }
      } catch (err) {
        toast.error('Failed to fetch settings. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle Save button click
  const handleSave = async () => {
    const payload = {
      userId: 1,
      agentNotRespondingEnabled: isCheckedAgent,
      agentNotRespondingMinutes: parseInt(agentMinutes) || 0,
      agentNotRespondingSeconds: parseInt(agentSeconds) || 0,
      archiveChatEnabled: isCheckedArchive,
      archiveChatMinutes: parseInt(archiveMinutes) || 0,
      archiveChatSeconds: parseInt(archiveSeconds) || 0,
      visitorInactivityMinutes: parseInt(visitorMinutes) || 0,
      visitorInactivitySeconds: parseInt(visitorSeconds) || 0,
      timeoutMessage: message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (currentSettingId === null) {
        // No existing setting, use POST to create a new one
        const response = await axios.post<InactivityTimeout>('https://zotly.onrender.com/api/v1/settings/inactivity-timeouts', payload);
        setCurrentSettingId(response.data.id || null);
        toast.success('Settings created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        // Existing setting, use PUT to update
        await axios.put(`https://zotly.onrender.com/api/v1/settings/inactivity-timeouts`, {
          ...payload,
          id: currentSettingId,
        });
        toast.success('Settings updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('Failed to save settings. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-12">Loading...</div>;
  }

  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
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
          <Select
            value={agentMinutes}
            onValueChange={setAgentMinutes}
            disabled={!isCheckedAgent}
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
          <span className="text-sm text-gray-700">minutes</span>
          <Select
            value={agentSeconds}
            onValueChange={setAgentSeconds}
            disabled={!isCheckedAgent}
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
          <Select
            value={archiveMinutes}
            onValueChange={setArchiveMinutes}
            disabled={!isCheckedArchive}
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
          <span className="text-sm text-gray-700">minutes</span>
          <Select
            value={archiveSeconds}
            onValueChange={setArchiveSeconds}
            disabled={!isCheckedArchive}
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
        {/* Timeout Message */}
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
            className="px-6 py-3 rounded-lg flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InactivityTimeoutsHeader;