"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { toast } from 'react-toastify';

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

const AddGlobalWebhookForm: React.FC<AddGlobalWebhookFormProps> = ({ onSave, onCancel, editingWebhook }) => {
  const [formData, setFormData] = useState({
    event: '',
    dataTypeEnabled: false,
    destination: '' as 'TARGET_URL' | 'EMAIL' | 'BOTH' | '',
    email: '',
    targetUrl: '',
    createdBy: '',
    company: '',
  });
  const [existingEvents, setExistingEvents] = useState<Set<string>>(new Set());

  const eventOptions = [
    'NEW_CUSTOMER',
    'NEW_EMPLOYEE',
    'RESTORE_PASSWORD',
    'NEW_INVOICE',
    'NEW_PAYMENT',
  ];

  const destinationOptions = ['TARGET_URL', 'EMAIL', 'BOTH'];

  // Fetch existing webhooks to validate against duplicate events
  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const response = await axios.get<GlobalWebhook[]>('https://zotly.onrender.com/api/v1/settings/global-webhooks');
        setExistingEvents(new Set(response.data.map((webhook) => webhook.event)));
      } catch (err) {
        toast.error('Failed to fetch existing webhooks for validation.', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error(err);
      }
    };

    fetchWebhooks();
  }, []);

  // Initialize form with editing data
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
    }
  }, [editingWebhook]);

  const validateForm = () => {
    if (!formData.event) {
      return 'Event is required.';
    }
    if (!editingWebhook && existingEvents.has(formData.event)) {
      return `Event "${formData.event}" already has a webhook.`;
    }
    if (!formData.destination) {
      return 'Destination is required.';
    }
    if (formData.destination === 'EMAIL' || formData.destination === 'BOTH') {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return 'A valid email is required for Email or Both destinations.';
      }
    }
    if (formData.destination === 'TARGET_URL' || formData.destination === 'BOTH') {
      if (!formData.targetUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.targetUrl)) {
        return 'A valid URL is required for Target URL or Both destinations.';
      }
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
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const payload: GlobalWebhook = {
      id: editingWebhook ? editingWebhook.id : Date.now(), // Temporary ID for new webhooks
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
      if (editingWebhook) {
        await axios.put('https://zotly.onrender.com/api/v1/settings/global-webhooks', payload);
        toast.success('Global webhook updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const response = await axios.post<GlobalWebhook>('https://zotly.onrender.com/api/v1/settings/global-webhooks', payload);
        payload.id = response.data.id; // Use server-generated ID
        toast.success('Global webhook created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      onSave();
      setFormData({
        event: '',
        dataTypeEnabled: false,
        destination: '',
        email: '',
        targetUrl: '',
        createdBy: '',
        company: '',
      });
    } catch (err) {
      toast.error('Failed to save global webhook. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {editingWebhook ? 'Edit Global Webhook' : 'Add a new global webhook'}
      </h1>
      <hr className="border-gray-300 mb-6" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">Event</Label>
          <RadioGroup
            value={formData.event}
            onValueChange={(value) => setFormData({ ...formData, event: value })}
            className="mt-2 space-y-2"
          >
            {eventOptions.map((event) => (
              <div key={event} className="flex items-center gap-2">
                <RadioGroupItem value={event} id={event} />
                <Label htmlFor={event} className="text-sm text-gray-700">
                  {event.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Data type</Label>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="customer-info"
                checked={formData.dataTypeEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, dataTypeEnabled: checked as boolean })}
              />
              <Label htmlFor="customer-info" className="text-sm text-gray-700">
                Customer info
              </Label>
            </div>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Data destination</Label>
          <Select
            value={formData.destination}
            onValueChange={(value) => setFormData({ ...formData, destination: value as 'TARGET_URL' | 'EMAIL' | 'BOTH' })}
          >
            <SelectTrigger className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {destinationOptions.map((destination) => (
                <SelectItem key={destination} value={destination}>
                  {destination.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email (e.g., test@example.com)"
          />
        </div>
        <div>
          <Label htmlFor="targetUrl" className="text-sm font-medium text-gray-700">
            Target URL
          </Label>
          <Input
            id="targetUrl"
            value={formData.targetUrl}
            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter target URL (e.g., http://example.com/webhook)"
          />
        </div>
        <div>
          <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">
            Created By
          </Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter creator name (e.g., admin)"
          />
        </div>
        <div>
          <Label htmlFor="company" className="text-sm font-medium text-gray-700">
            Company
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter company name (e.g., Example Corp)"
          />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            className="px-6 py-2 border-gray-300 text-gray-800"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-800"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGlobalWebhookForm;