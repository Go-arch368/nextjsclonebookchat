"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { toast } from 'react-toastify';

interface Webhook {
  id: number;
  userId: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface AddWebhookFormProps {
  onSave: () => void;
  onCancel: () => void;
  editingWebhook: Webhook | null;
}

const AddWebhookForm: React.FC<AddWebhookFormProps> = ({ onSave, onCancel, editingWebhook }) => {
  const [formData, setFormData] = useState({
    event: '',
    dataTypes: [] as string[],
    targetUrl: '',
    createdBy: '',
    company: '',
  });
  const [existingEvents, setExistingEvents] = useState<Set<string>>(new Set());

  const eventOptions = [
    'CHAT_STARTS',
    'CHAT_ENDS',
    'NEW_MESSAGE',
    'VISITOR_OFFLINE',
    'VISITOR_ONLINE',
  ];

  const dataTypeOptions = ['Visitor Info', 'Chat Info', 'Message Content'];

  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const response = await axios.get<Webhook[]>('https://zotly.onrender.com/api/v1/settings/webhooks/all');
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

  useEffect(() => {
    if (editingWebhook) {
      setFormData({
        event: editingWebhook.event,
        dataTypes: editingWebhook.dataTypes,
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
    if (formData.dataTypes.length === 0) {
      return 'At least one data type is required.';
    }
    if (!formData.targetUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.targetUrl)) {
      return 'A valid URL is required for Target URL.';
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

    const payload: Webhook = {
      id: editingWebhook ? editingWebhook.id : Date.now(),
      userId: 1,
      event: formData.event,
      dataTypes: formData.dataTypes,
      targetUrl: formData.targetUrl,
      createdBy: formData.createdBy,
      company: formData.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingWebhook) {
        await axios.put('https://zotly.onrender.com/api/v1/settings/webhooks/update', payload);
        toast.success('Webhook updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const response = await axios.post<Webhook>('https://zotly.onrender.com/api/v1/settings/webhooks/save', payload);
        payload.id = response.data.id;
        toast.success('Webhook created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      onSave();
      setFormData({
        event: '',
        dataTypes: [],
        targetUrl: '',
        createdBy: '',
        company: '',
      });
    } catch (err) {
      toast.error('Failed to save webhook. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dataTypes: checked
        ? [...prev.dataTypes, dataType]
        : prev.dataTypes.filter((type) => type !== dataType),
    }));
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {editingWebhook ? 'Edit Webhook' : 'Add a new webhook'}
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
          <Label className="text-sm font-medium text-gray-700">Data Types</Label>
          <div className="mt-2 space-y-2">
            {dataTypeOptions.map((dataType) => (
              <div key={dataType} className="flex items-center gap-2">
                <Checkbox
                  id={dataType}
                  checked={formData.dataTypes.includes(dataType)}
                  onCheckedChange={(checked) => handleDataTypeChange(dataType, checked as boolean)}
                />
                <Label htmlFor={dataType} className="text-sm text-gray-700">
                  {dataType}
                </Label>
              </div>
            ))}
          </div>
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

export default AddWebhookForm;