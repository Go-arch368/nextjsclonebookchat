'use client';

import React, { useState } from 'react';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';
import { Button } from '@/ui/button';

export default function CreatePlanForm() {
  const [form, setForm] = useState({
    planName: '',
    planDescription: '',
    isFree: false,
    priceMonthly: '',
    priceAnnually: '',
    isActive: true,
    isDefault: false,
    unlimitedChat: false,
    numChats: '',
    extraChatAmount: '',
    unlimitedHistory: false,
    historyDuration: '',
    historyExtraCost: '',
    unlimitedUsers: false,
    NumberOfUsers: '',
    ExtraUsersAmount: '',
    NumberOfWebsites: '',
    ExtraWebsitesAmount: '',
    ChatTakeover: false,
    ChatTagging: false,
    ChatTranscript: false,
    ChatbotFromOpenAiIncluded: false,
    managedAccount: false,
    customPlan: false,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Plan Submitted:', form);
    // TODO: Send form data to API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="planName">Plan Name</Label>
          <Input
            id="planName"
            value={form.planName}
            onChange={(e) => handleChange('planName', e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="planDescription">Plan Description</Label>
          <Textarea
            id="planDescription"
            value={form.planDescription}
            onChange={(e) => handleChange('planDescription', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <Label>Free Plan</Label>
          <Switch
            checked={form.isFree}
            onCheckedChange={(val) => handleChange('isFree', val)}
          />
        </div>

        {!form.isFree && (
          <>
            <div className="flex flex-col space-y-1">
              <Label>Price Monthly ($)</Label>
              <Input
                type="number"
                value={form.priceMonthly}
                onChange={(e) => handleChange('priceMonthly', e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Price Annually ($)</Label>
              <Input
                type="number"
                value={form.priceAnnually}
                onChange={(e) => handleChange('priceAnnually', e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-x-4">
          <Label>Active Plan</Label>
          <Switch
            checked={form.isActive}
            onCheckedChange={(val) => handleChange('isActive', val)}
          />
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <Label>Default Plan</Label>
          <Switch
            checked={form.isDefault}
            onCheckedChange={(val) => handleChange('isDefault', val)}
          />
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <Label>Unlimited Chat</Label>
          <Switch
            checked={form.unlimitedChat}
            onCheckedChange={(val) => handleChange('unlimitedChat', val)}
          />
        </div>

        {!form.unlimitedChat && (
          <>
            <div className="flex flex-col space-y-1">
              <Label>Number of Chats</Label>
              <Input
                type="number"
                value={form.numChats}
                onChange={(e) => handleChange('numChats', e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Extra Chat Amount ($)</Label>
              <Input
                type="number"
                value={form.extraChatAmount}
                onChange={(e) => handleChange('extraChatAmount', e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-x-4">
          <Label>Unlimited Chat History Storage</Label>
          <Switch
            checked={form.unlimitedHistory}
            onCheckedChange={(val) => handleChange('unlimitedHistory', val)}
          />
        </div>

        {!form.unlimitedHistory && (
          <>
            <div className="flex flex-col space-y-1">
              <Label>Chat History Duration (in days)</Label>
              <Input
                type="number"
                value={form.historyDuration}
                onChange={(e) => handleChange('historyDuration', e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Cost per Extra Day of Storage ($)</Label>
              <Input
                type="number"
                value={form.historyExtraCost}
                onChange={(e) => handleChange('historyExtraCost', e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-x-4">
          <Label>Unlimited Users</Label>
          <Switch
            checked={form.unlimitedUsers}
            onCheckedChange={(val) => handleChange('unlimitedUsers', val)}
          />
        </div>

        {!form.unlimitedUsers && (
          <>
            <div className="flex flex-col space-y-1">
              <Label>Number of Users</Label>
              <Input
                type="number"
                value={form.NumberOfUsers}
                onChange={(e) => handleChange('NumberOfUsers', e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Extra User Cost ($)</Label>
              <Input
                type="number"
                value={form.ExtraUsersAmount}
                onChange={(e) => handleChange('ExtraUsersAmount', e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex flex-col space-y-1">
          <Label>Number of Websites</Label>
          <Input
            type="number"
            value={form.NumberOfWebsites}
            onChange={(e) => handleChange('NumberOfWebsites', e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label>Extra Website Cost ($)</Label>
          <Input
            type="number"
            value={form.ExtraWebsitesAmount}
            onChange={(e) => handleChange('ExtraWebsitesAmount', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <Label>Chat Takeover</Label>
          <Switch
            checked={form.ChatTakeover}
            onCheckedChange={(val) => handleChange('ChatTakeover', val)}
          />
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <Label>Chat Tagging</Label>
          <Switch
            checked={form.ChatTagging}
            onCheckedChange={(val) => handleChange('ChatTagging', val)}
          />
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <Label>Chat Transcript</Label>
          <Switch
            checked={form.ChatTranscript}
            onCheckedChange={(val) => handleChange('ChatTranscript', val)}
          />
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <Label>Chatbot (OpenAI Included)</Label>
          <Switch
            checked={form.ChatbotFromOpenAiIncluded}
            onCheckedChange={(val) => handleChange('ChatbotFromOpenAiIncluded', val)}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <Label>Managed Account</Label>
          <Switch
            checked={form.managedAccount}
            onCheckedChange={(val) => handleChange('managedAccount', val)}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <Label>Custom Plan</Label>
          <Switch
            checked={form.customPlan}
            onCheckedChange={(val) => handleChange('customPlan', val)}
          />
        </div>
      </div>


      <Button type="submit" className="w-full sm:w-auto">
        Save Plan
      </Button>
    </form>
  );
}
