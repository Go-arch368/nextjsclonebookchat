"use client";

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { toast } from 'react-toastify';

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
  const [isSaving, setIsSaving] = useState(false);

  // Generate options for minutes and seconds (0 to 59)
  const timeOptions = Array.from({ length: 60 }, (_, i) => i.toString());

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/settings/inactivity-timeouts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const settings = await response.json();

      if (settings.length > 0) {
        // Safe sorting with date validation
        const latestSetting = [...settings].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA; // Sort descending (newest first)
        })[0];

        setCurrentSettingId(latestSetting.id || null);
        setIsCheckedAgent(latestSetting.agentNotRespondingEnabled);
        setIsCheckedArchive(latestSetting.archiveChatEnabled);
        setAgentMinutes(latestSetting.agentNotRespondingMinutes?.toString() || '0');
        setAgentSeconds(latestSetting.agentNotRespondingSeconds?.toString() || '0');
        setArchiveMinutes(latestSetting.archiveChatMinutes?.toString() || '0');
        setArchiveSeconds(latestSetting.archiveChatSeconds?.toString() || '0');
        setVisitorMinutes(latestSetting.visitorInactivityMinutes?.toString() || '2');
        setVisitorSeconds(latestSetting.visitorInactivitySeconds?.toString() || '0');
        setMessage(latestSetting.timeoutMessage || 'Please respond in $time');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all inactivity timeout settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle Save button click
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        userId: 1,
        agentNotRespondingEnabled: isCheckedAgent,
        agentNotRespondingMinutes: parseInt(agentMinutes) || 0,
        agentNotRespondingSeconds: parseInt(agentSeconds) || 0,
        archiveChatEnabled: isCheckedArchive,
        archiveChatMinutes: parseInt(archiveMinutes) || 0,
        archiveChatSeconds: parseInt(archiveSeconds) || 0,
        visitorInactivityMinutes: parseInt(visitorMinutes) || 2,
        visitorInactivitySeconds: parseInt(visitorSeconds) || 0,
        timeoutMessage: message
      };

      const url = '/api/v1/settings/inactivity-timeouts';
      const method = currentSettingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          currentSettingId 
            ? { ...payload, id: currentSettingId }
            : { 
                ...payload,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }

      const result = await response.json();
      setCurrentSettingId(result.id || null);
      toast.success('Settings saved successfully!');
      
      // Refresh the settings
      await fetchSettings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
          <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Inactivity Timeouts</h1>
        <hr className="border-gray-300" />
      </div>
      
      <div className="mt-6 space-y-6">
        {/* Agent Not Responding Section */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="agent-checkbox"
              checked={isCheckedAgent}
              onCheckedChange={(checked) => setIsCheckedAgent(!!checked)}
            />
            <Label htmlFor="agent-checkbox">When agent doesn't respond for</Label>
          </div>
          <Select
            value={agentMinutes}
            onValueChange={setAgentMinutes}
            disabled={!isCheckedAgent}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={`agent-min-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>minutes</span>
          <Select
            value={agentSeconds}
            onValueChange={setAgentSeconds}
            disabled={!isCheckedAgent}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={`agent-sec-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>seconds, put him back in the queue</span>
        </div>

        {/* Archive Chat Section */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="archive-checkbox"
              checked={isCheckedArchive}
              onCheckedChange={(checked) => setIsCheckedArchive(!!checked)}
            />
            <Label htmlFor="archive-checkbox">When agent doesn't respond for</Label>
          </div>
          <Select
            value={archiveMinutes}
            onValueChange={setArchiveMinutes}
            disabled={!isCheckedArchive}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={`archive-min-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>minutes</span>
          <Select
            value={archiveSeconds}
            onValueChange={setArchiveSeconds}
            disabled={!isCheckedArchive}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={`archive-sec-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>seconds, archive the chat</span>
        </div>

        {/* Visitor Inactivity Section */}
        <div className="flex flex-wrap items-center gap-2">
          <Label>
            When there are no new messages from the visitor for
          </Label>
          <Select
            value={visitorMinutes}
            onValueChange={setVisitorMinutes}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={`visitor-min-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>minutes</span>
          <Select
            value={visitorSeconds}
            onValueChange={setVisitorSeconds}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={`visitor-sec-${option}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>seconds after agent responded, put him back in the queue</span>
        </div>

        {/* Timeout Message Section */}
        <div className="space-y-2">
          <Label>When agent responded send message about timeout to visitor:</Label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please respond in $time"
          />
          <p className="text-sm text-gray-500">
            Use $time to include the countdown timer
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InactivityTimeoutsHeader;