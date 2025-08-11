
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
  webhooks: Webhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
  setError: (error: string | null) => void;
}

const AddWebhookForm: React.FC<AddWebhookFormProps> = ({
  onSave,
  onCancel,
  editingWebhook,
  webhooks,
  setWebhooks,
  setError,
}) => {
  const [formData, setFormData] = useState({
    event: '',
    dataTypes: [] as string[],
    targetUrl: '',
    createdBy: '',
    company: '',
  });
  const [errors, setErrors] = useState<{
    event?: string;
    dataTypes?: string;
    targetUrl?: string;
    createdBy?: string;
    company?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = '/api/v1/settings/webhooks';

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

  const validateForm = () => {
    const newErrors: { event?: string; dataTypes?: string; targetUrl?: string; createdBy?: string; company?: string } = {};
    if (!formData.event) {
      newErrors.event = 'Event is required';
    }
    if (formData.dataTypes.length === 0) {
      newErrors.dataTypes = 'At least one data type is required';
    }
    if (!formData.targetUrl.trim()) {
      newErrors.targetUrl = 'Target URL is required';
    } else {
      try {
        new URL(formData.targetUrl);
        // Check for duplicate targetUrl for the same event (excluding current webhook)
        if (
          webhooks.some(
            (w) =>
              w.event === formData.event &&
              w.targetUrl.toLowerCase() === formData.targetUrl.toLowerCase() &&
              (!editingWebhook || w.id !== editingWebhook.id)
          )
        ) {
          newErrors.targetUrl = `Target URL "${formData.targetUrl}" already exists for event "${formData.event}"`;
        }
      } catch {
        newErrors.targetUrl = 'Invalid URL format';
      }
    }
    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Created By is required';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const payload: Webhook = {
      id: editingWebhook ? editingWebhook.id : 0,
      userId: 1,
      event: formData.event,
      dataTypes: formData.dataTypes,
      targetUrl: formData.targetUrl.trim(),
      createdBy: formData.createdBy.trim().toLowerCase(),
      company: formData.company.trim(),
      createdAt: editingWebhook ? editingWebhook.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axios({
        method: editingWebhook ? 'PUT' : 'POST',
        url: API_BASE_URL,
        headers: { 'Content-Type': 'application/json' },
        data: payload,
      });

      setWebhooks((prev) =>
        editingWebhook
          ? prev.map((w) => (w.id === response.data.id ? response.data : w))
          : [...prev, response.data]
      );
      toast.success(`Webhook ${editingWebhook ? 'updated' : 'created'} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      onSave();
      setFormData({
        event: '',
        dataTypes: [],
        targetUrl: '',
        createdBy: '',
        company: '',
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Webhooks API route not found. Please check the server configuration.'
          : err.response?.status === 405
          ? 'Method not allowed. Please check the API configuration.'
          : err.response?.data?.message || err.message || `Failed to ${editingWebhook ? 'update' : 'create'} webhook`;
      console.error('API error:', err, {
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(message);
      if (message.includes('Duplicate entry') && message.includes('for key')) {
        const urlMatch = message.match(/Duplicate entry '([^']+)' for key/);
        const url = urlMatch ? urlMatch[1] : formData.targetUrl;
        toast.error(`Webhook with URL "${url}" for event "${formData.event}" already exists`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
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
    setErrors((prev) => ({ ...prev, dataTypes: '' }));
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {editingWebhook ? 'Edit Webhook' : 'Add a new webhook'}
      </h1>
      <hr className="border-gray-300 mb-6" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">Event *</Label>
          <RadioGroup
            value={formData.event}
            onValueChange={(value) => {
              setFormData({ ...formData, event: value });
              setErrors((prev) => ({ ...prev, event: '' }));
            }}
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
          {errors.event && <p className="text-red-500 text-sm mt-1">{errors.event}</p>}
        </div>
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
                  className="h-4 w-4 text-blue-500"
                />
                <Label htmlFor={dataType} className="text-sm text-gray-700">
                  {dataType}
                </Label>
              </div>
            ))}
          </div>
          {errors.dataTypes && <p className="text-red-500 text-sm mt-1">{errors.dataTypes}</p>}
        </div>
        <div>
          <Label htmlFor="targetUrl" className="text-sm font-medium text-gray-700">Target URL *</Label>
          <Input
            id="targetUrl"
            value={formData.targetUrl}
            onChange={(e) => {
              setFormData({ ...formData, targetUrl: e.target.value });
              setErrors((prev) => ({ ...prev, targetUrl: '' }));
            }}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.targetUrl ? 'border-red-500' : ''}`}
            placeholder="Enter target URL (e.g., https://example.com/webhook)"
            disabled={isSubmitting}
          />
          {errors.targetUrl && <p className="text-red-500 text-sm mt-1">{errors.targetUrl}</p>}
        </div>
        <div>
          <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">Created By *</Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => {
              setFormData({ ...formData, createdBy: e.target.value });
              setErrors((prev) => ({ ...prev, createdBy: '' }));
            }}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.createdBy ? 'border-red-500' : ''}`}
            placeholder="Enter creator name (e.g., admin)"
            disabled={isSubmitting}
          />
          {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
        </div>
        <div>
          <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => {
              setFormData({ ...formData, company: e.target.value });
              setErrors((prev) => ({ ...prev, company: '' }));
            }}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-500' : ''}`}
            placeholder="Enter company name (e.g., titanss)"
            disabled={isSubmitting}
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
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
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {editingWebhook ? 'Updating...' : 'Creating...'}
              </span>
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
