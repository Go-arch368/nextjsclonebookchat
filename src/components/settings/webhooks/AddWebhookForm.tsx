"use client";

import React, { useState, useEffect } from 'react';
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
  onSave: (webhook: Webhook) => void;
  onCancel: () => void;
  editingWebhook: Webhook | null;
}

const AddWebhookForm: React.FC<AddWebhookFormProps> = ({
  onSave,
  onCancel,
  editingWebhook,
}) => {
  const [formData, setFormData] = useState({
    event: '',
    dataTypes: [] as string[],
    targetUrl: '',
    createdBy: '',
    company: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    return now.toISOString();
  };

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dataTypes: checked
        ? [...prev.dataTypes, dataType]
        : prev.dataTypes.filter(type => type !== dataType),
    }));
  };

 const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.event) {
    newErrors.event = 'Event is required';
  }

  if (formData.dataTypes.length === 0) {
    newErrors.dataTypes = 'At least one data type is required';
  }

  if (!formData.targetUrl) {
    newErrors.targetUrl = 'Target URL is required';
  } else {
    try {
      new URL(formData.targetUrl);
    } catch (e) {
      newErrors.targetUrl = 'Please enter a valid URL (include http:// or https://)';
    }
  }

  if (!formData.createdBy) {
    newErrors.createdBy = 'Created By is required';
  }

  if (!formData.company) {
    newErrors.company = 'Company is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);
  try {
    const payload = {
      userId: 1, // Replace with actual user ID if available
      event: formData.event,
      dataTypes: formData.dataTypes,
      targetUrl: formData.targetUrl,
      createdBy: formData.createdBy,
      company: formData.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    const method = editingWebhook ? 'PUT' : 'POST';
    const response = await fetch('/api/v1/settings/webhooks', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingWebhook ? { ...payload, id: editingWebhook.id } : payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to save webhook');
    }

    const savedWebhook = await response.json();
    onSave(savedWebhook);
    toast.success('Webhook saved successfully!');
  } catch (error: any) {
    console.error('Error saving webhook:', error);
    toast.error(error.message || 'Failed to save webhook');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {editingWebhook ? 'Edit Webhook' : 'Add New Webhook'}
      </h1>
      <hr className="border-gray-300 mb-6" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Event *</Label>
          <RadioGroup
            value={formData.event}
            onValueChange={(value) => setFormData({ ...formData, event: value })}
            className="mt-2 space-y-2"
          >
            {eventOptions.map((event) => (
              <div key={event} className="flex items-center gap-2">
                <RadioGroupItem 
                  value={event} 
                  id={event} 
                  disabled={isSubmitting} 
                />
                <Label htmlFor={event} className="text-sm text-gray-700">
                  {event.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.event && <p className="text-red-500 text-sm mt-1">{errors.event}</p>}
        </div>

        {/* Data Types */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Data Types *</Label>
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
          {errors.dataTypes && <p className="text-red-500 text-sm mt-1">{errors.dataTypes}</p>}
        </div>

        {/* Target URL */}
        <div>
          <Label htmlFor="targetUrl" className="text-sm font-medium text-gray-700">
            Target URL *
          </Label>
          <Input
            id="targetUrl"
            value={formData.targetUrl}
            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
            className={`w-full mt-2 ${errors.targetUrl ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="https://example.com/webhook"
            disabled={isSubmitting}
          />
          {errors.targetUrl && <p className="text-red-500 text-sm mt-1">{errors.targetUrl}</p>}
        </div>

        {/* Created By */}
        <div>
          <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">
            Created By *
          </Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className={`w-full mt-2 ${errors.createdBy ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="admin"
            disabled={isSubmitting}
          />
          {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
        </div>

        {/* Company */}
        <div>
          <Label htmlFor="company" className="text-sm font-medium text-gray-700">
            Company *
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={`w-full mt-2 ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your Company"
            disabled={isSubmitting}
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingWebhook ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingWebhook ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWebhookForm;