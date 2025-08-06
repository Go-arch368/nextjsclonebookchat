
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventOptions = [
    'CHAT_STARTS',
    'CHAT_ENDS',
    'NEW_MESSAGE',
    'VISITOR_OFFLINE',
    'VISITOR_ONLINE',
  ];

  const dataTypeOptions = ['Visitor Info', 'Chat Info', 'Message Content'];

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

  const formatTimestamp = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19); // e.g., "2025-08-02T11:52:46"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Prepare payload matching the Postman JSON schema exactly
      const payload: Omit<Webhook, 'id'> = {
        userId: 1, // Hardcoded to match Postman; replace with dynamic userId if available
        // userId: currentUser.id || 1, // Example for dynamic userId
        event: formData.event,
        dataTypes: formData.dataTypes,
        targetUrl: formData.targetUrl,
        createdBy: formData.createdBy.toLowerCase(), // Normalize to match "admin"
        company: formData.company,
        createdAt: formatTimestamp(),
        updatedAt: formatTimestamp(),
      };

      console.log('POST /save payload:', JSON.stringify(payload, null, 2)); // Pretty-print payload

      if (editingWebhook) {
        const updatePayload: Webhook = { ...payload, id: editingWebhook.id };
        const response = await axios.put<Webhook>(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/webhooks/update`, updatePayload, {
          headers: {
            'Content-Type': 'application/json',
            // Uncomment if authentication is required
            // 'Authorization': 'Bearer <your-token-here>',
          },
        });
        console.log('PUT /update response:', JSON.stringify(response.data, null, 2)); // Pretty-print response
        toast.success('Webhook updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const response = await axios.post<Webhook>(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/webhooks/save`, payload);
        console.log('POST /save response:', JSON.stringify(response.data, null, 2)); // Pretty-print response
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
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save webhook.';
      console.error('Save webhook error:', errorMessage, {
        status: err.response?.status,
        data: JSON.stringify(err.response?.data, null, 2),
        headers: err.response?.headers,
        request: {
          url: err.config?.url,
          method: err.config?.method,
          data: JSON.stringify(err.config?.data, null, 2),
        },
      });
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
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
                <RadioGroupItem value={event} id={event} disabled={isSubmitting} />
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
                  disabled={isSubmitting}
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
            placeholder="Enter target URL (e.g., https://example.com/webhook)"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            placeholder="Enter company name (e.g., titanss)"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            className="px-6 py-2 border-gray-300 text-gray-800"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWebhookForm;
