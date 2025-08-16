"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';

interface GlobalWebhook {
  id: number;
  userId: number;
  event: string;
  dataTypeEnabled: boolean;
  destination: 'TARGET_URL' | 'EMAIL' | 'BOTH';
  email: string;
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface AddGlobalWebhookFormProps {
  onSave: () => void;
  onCancel: () => void;
  editingWebhook: GlobalWebhook | null;
}

const AddGlobalWebhookForm: React.FC<AddGlobalWebhookFormProps> = ({ 
  onSave, 
  onCancel, 
  editingWebhook 
}) => {
  const [formData, setFormData] = useState({
    event: '',
    dataTypeEnabled: false,
    destination: '' as 'TARGET_URL' | 'EMAIL' | 'BOTH' | '',
    email: '',
    targetUrl: '',
    createdBy: '',
    company: '',
  });
  const { theme } = useTheme();

  const eventOptions = [
    'NEW_CUSTOMER',
    'NEW_EMPLOYEE',
    'RESTORE_PASSWORD',
    'NEW_INVOICE',
    'NEW_PAYMENT',
  ];

  const destinationOptions = ['TARGET_URL', 'EMAIL', 'BOTH'];

  useEffect(() => {
    if (editingWebhook) {
      setFormData({
        event: editingWebhook.event,
        dataTypeEnabled: editingWebhook.dataTypeEnabled,
        destination: editingWebhook.destination,
        email: editingWebhook.email,
        targetUrl: editingWebhook.targetUrl,
        createdBy: editingWebhook.createdBy,
        company: editingWebhook.company,
      });
    } else {
      setFormData({
        event: '',
        dataTypeEnabled: false,
        destination: '',
        email: '',
        targetUrl: '',
        createdBy: '',
        company: '',
      });
    }
  }, [editingWebhook]);

  const validateForm = () => {
    if (!formData.event) {
      return 'Event is required.';
    }
    if (!formData.destination) {
      return 'Destination is required.';
    }
    if ((formData.destination === 'EMAIL' || formData.destination === 'BOTH') && !formData.email) {
      return 'Email is required for Email or Both destinations.';
    }
    if ((formData.destination === 'TARGET_URL' || formData.destination === 'BOTH') && !formData.targetUrl) {
      return 'Target URL is required for Target URL or Both destinations.';
    }
    if (!formData.createdBy) {
      return 'Created By is required.';
    }
    if (!formData.company) {
      return 'Company is required.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload: GlobalWebhook = {
      id: editingWebhook?.id || Date.now(),
      userId: 1,
      event: formData.event,
      dataTypeEnabled: formData.dataTypeEnabled,
      destination: formData.destination as 'TARGET_URL' | 'EMAIL' | 'BOTH',
      email: formData.email,
      targetUrl: formData.targetUrl,
      createdBy: formData.createdBy,
      company: formData.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const method = editingWebhook ? 'PUT' : 'POST';
      const url = editingWebhook 
        ? `/api/v1/settings/global-webhooks?id=${editingWebhook.id}`
        : '/api/v1/settings/global-webhooks';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save webhook');

      toast.success(`Webhook ${editingWebhook ? 'updated' : 'created'} successfully`);
      onSave();
    } catch (error) {
      toast.error('Failed to save webhook');
      console.error(error);
    }
  };

  const formatEventName = (event: string) => {
    return event.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className={`p-10 rounded-xl shadow-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h1 className={`text-4xl font-bold mb-10 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {editingWebhook ? 'Edit Global Webhook' : 'Add a new global webhook'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Event</Label>
          <RadioGroup
            value={formData.event}
            onValueChange={(value) => setFormData({ ...formData, event: value })}
            className="mt-2 space-y-2"
          >
            {eventOptions.map((event) => (
              <div key={event} className="flex items-center gap-2">
                <RadioGroupItem value={event} id={event} />
                <Label htmlFor={event} className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatEventName(event)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Data Type</Label>
          <div className="mt-2 flex items-center gap-2">
            <Checkbox
              id="dataTypeEnabled"
              checked={formData.dataTypeEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, dataTypeEnabled: checked as boolean })}
            />
            <Label htmlFor="dataTypeEnabled" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Include customer data
            </Label>
          </div>
        </div>

        <div>
          <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Destination</Label>
          <Select
            value={formData.destination}
            onValueChange={(value) => setFormData({ ...formData, destination: value as 'TARGET_URL' | 'EMAIL' | 'BOTH' })}
          >
            <SelectTrigger className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              {destinationOptions.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option}
                  className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
                >
                  {formatEventName(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(formData.destination === 'EMAIL' || formData.destination === 'BOTH') && (
          <div>
            <Label htmlFor="email" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
              placeholder="Enter email address"
              required
            />
          </div>
        )}

        {(formData.destination === 'TARGET_URL' || formData.destination === 'BOTH') && (
          <div>
            <Label htmlFor="targetUrl" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Target URL
            </Label>
            <Input
              id="targetUrl"
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
              placeholder="Enter target URL (e.g., https://example.com/webhook)"
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="createdBy" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Created By
          </Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
            placeholder="Enter creator name"
            required
          />
        </div>

        <div>
          <Label htmlFor="company" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Company
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            className={`px-6 py-2 ${theme === 'dark' ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-800'}`}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-800"
          >
            {editingWebhook ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGlobalWebhookForm;