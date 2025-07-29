// src/components/billing/PlanForm.tsx
'use client';

import React, { useState } from 'react';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';
import { Button } from '@/ui/button';
import { useBillingStore } from '@/stores/useBillingStore';
import { PricePlan } from '@/types/Billing';
import { toast } from 'react-toastify';

interface CreatePlanFormProps {
  plan?: PricePlan;
  isEdit?: boolean;
  onClose?: () => void;
}

export default function CreatePlanForm({ plan, isEdit = false, onClose }: CreatePlanFormProps) {
  const { createPricePlan, updatePricePlan } = useBillingStore();
  const [form, setForm] = useState({
    planName: plan?.planName || '',
    planDescription: plan?.planDescription || '',
    freePlan: plan?.freePlan || false,
    priceMonthly: plan?.priceMonthly?.toString() || '',
    priceAnnually: plan?.priceAnnually?.toString() || '',
    status: plan?.status || 'active',
    defaultPlan: plan?.defaultPlan || false,
    unlimitedChat: plan?.unlimitedChat || false,
    numberOfChats: plan?.numberOfChats?.toString() || '',
    extraChatAmount: plan?.extraChatAmount?.toString() || '',
    unlimitedChatHistoryStorage: plan?.unlimitedChatHistoryStorage || false,
    chatHistoryDurationDays: plan?.chatHistoryDurationDays?.toString() || '',
    costPerExtraDayOfStorage: plan?.costPerExtraDayOfStorage?.toString() || '',
    unlimitedUsers: plan?.unlimitedUsers || false,
    numberOfUsers: plan?.numberOfUsers?.toString() || '',
    extraUserCost: plan?.extraUserCost?.toString() || '',
    numberOfWebsites: plan?.numberOfWebsites?.toString() || '',
    extraWebsiteCost: plan?.extraWebsiteCost?.toString() || '',
    chatTakeover: plan?.chatTakeover || false,
    chatTagging: plan?.chatTagging || false,
    chatTranscript: plan?.chatTranscript || false,
    chatbotOpenaiIncluded: plan?.chatbotOpenaiIncluded || false,
    managedAccount: plan?.managedAccount || false,
    customPlan: plan?.customPlan || false,
    type: plan?.type || 'public',
    createdAt: plan?.createdAt || new Date().toISOString().slice(0, 19),
    dateAdded: plan?.dateAdded || new Date().toISOString().slice(0, 19),
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: PricePlan = {
        id: plan?.id || 0,
        planName: form.planName,
        planDescription: form.planDescription,
        freePlan: form.freePlan,
        priceMonthly: form.freePlan ? 0 : parseFloat(form.priceMonthly) || 0,
        priceAnnually: form.freePlan ? 0 : parseFloat(form.priceAnnually) || 0,
        status: form.status,
        defaultPlan: form.defaultPlan,
        unlimitedChat: form.unlimitedChat,
        numberOfChats: form.unlimitedChat ? 0 : parseInt(form.numberOfChats) || 0,
        extraChatAmount: form.unlimitedChat ? 0 : parseFloat(form.extraChatAmount) || 0,
        unlimitedChatHistoryStorage: form.unlimitedChatHistoryStorage,
        chatHistoryDurationDays: form.unlimitedChatHistoryStorage
          ? 0
          : parseInt(form.chatHistoryDurationDays) || 0,
        costPerExtraDayOfStorage: form.unlimitedChatHistoryStorage
          ? 0
          : parseFloat(form.costPerExtraDayOfStorage) || 0,
        unlimitedUsers: form.unlimitedUsers,
        numberOfUsers: form.unlimitedUsers ? 0 : parseInt(form.numberOfUsers) || 0,
        extraUserCost: form.unlimitedUsers ? 0 : parseFloat(form.extraUserCost) || 0,
        numberOfWebsites: parseInt(form.numberOfWebsites) || 0,
        extraWebsiteCost: parseFloat(form.extraWebsiteCost) || 0,
        chatTakeover: form.chatTakeover,
        chatTagging: form.chatTagging,
        chatTranscript: form.chatTranscript,
        chatbotOpenaiIncluded: form.chatbotOpenaiIncluded,
        managedAccount: form.managedAccount,
        customPlan: form.customPlan,
        type: form.type,
        createdAt: form.createdAt,
        updatedAt: new Date().toISOString().slice(0, 19),
        dateAdded: form.dateAdded,
      };

      if (isEdit && plan?.id) {
        await updatePricePlan(payload);
      } else {
        const { id, createdAt, updatedAt, dateAdded, ...createPayload } = payload;
        await createPricePlan(createPayload);
      }
      onClose?.();
    } catch (error) {
      console.error('Failed to save price plan:', error);
      toast.error('Failed to save price plan');
    }
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
            checked={form.freePlan}
            onCheckedChange={(val) => handleChange('freePlan', val)}
          />
        </div>
        {!form.freePlan && (
          <>
            <div className="flex flex-col space-y-1">
              <Label>Price Monthly ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.priceMonthly}
                onChange={(e) => handleChange('priceMonthly', e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Price Annually ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.priceAnnually}
                onChange={(e) => handleChange('priceAnnually', e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-between gap-x-4">
          <Label>Active Plan</Label>
          <Switch
            checked={form.status === 'active'}
            onCheckedChange={(val) => handleChange('status', val ? 'active' : 'inactive')}
          />
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <Label>Default Plan</Label>
          <Switch
            checked={form.defaultPlan}
            onCheckedChange={(val) => handleChange('defaultPlan', val)}
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
                value={form.numberOfChats}
                onChange={(e) => handleChange('numberOfChats', e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Extra Chat Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.extraChatAmount}
                onChange={(e) => handleChange('extraChatAmount', e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-between gap-x-4">
          <Label>Unlimited Chat History Storage</Label>
          <Switch
            checked={form.unlimitedChatHistoryStorage}
            onCheckedChange={(val) => handleChange('unlimitedChatHistoryStorage', val)}
          />
        </div>
        {!form.unlimitedChatHistoryStorage && (
          <>
            <div className="flex flex-col space-y-1">
              <Label>Chat History Duration (in days)</Label>
              <Input
                type="number"
                value={form.chatHistoryDurationDays}
                onChange={(e) => handleChange('chatHistoryDurationDays', e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Cost per Extra Day of Storage ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.costPerExtraDayOfStorage}
                onChange={(e) => handleChange('costPerExtraDayOfStorage', e.target.value)}
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
                value={form.numberOfUsers}
                onChange={(e) => handleChange('numberOfUsers', e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label>Extra User Cost ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.extraUserCost}
                onChange={(e) => handleChange('extraUserCost', e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex flex-col space-y-1">
          <Label>Number of Websites</Label>
          <Input
            type="number"
            value={form.numberOfWebsites}
            onChange={(e) => handleChange('numberOfWebsites', e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label>Extra Website Cost ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.extraWebsiteCost}
            onChange={(e) => handleChange('extraWebsiteCost', e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <Label>Chat Takeover</Label>
          <Switch
            checked={form.chatTakeover}
            onCheckedChange={(val) => handleChange('chatTakeover', val)}
          />
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <Label>Chat Tagging</Label>
          <Switch
            checked={form.chatTagging}
            onCheckedChange={(val) => handleChange('chatTagging', val)}
          />
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <Label>Chat Transcript</Label>
          <Switch
            checked={form.chatTranscript}
            onCheckedChange={(val) => handleChange('chatTranscript', val)}
          />
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <Label>Chatbot (OpenAI Included)</Label>
          <Switch
            checked={form.chatbotOpenaiIncluded}
            onCheckedChange={(val) => handleChange('chatbotOpenaiIncluded', val)}
          />
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <Label>Managed Account</Label>
          <Switch
            checked={form.managedAccount}
            onCheckedChange={(val) => handleChange('managedAccount', val)}
          />
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <Label>Custom Plan</Label>
          <Switch
            checked={form.customPlan}
            onCheckedChange={(val) => handleChange('customPlan', val)}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label>Type</Label>
          <select
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="border rounded p-2"
          >
            <option value="public">Public</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        {isEdit ? 'Update Plan' : 'Save Plan'}
      </Button>
    </form>
  );
}