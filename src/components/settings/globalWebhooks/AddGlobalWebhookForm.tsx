
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
  webhooks: GlobalWebhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<GlobalWebhook[]>>;
  setError: (error: string | null) => void;
}

const AddGlobalWebhookForm: React.FC<AddGlobalWebhookFormProps> = ({
  onSave,
  onCancel,
  editingWebhook,
  webhooks,
  setWebhooks,
  setError,
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
  const [errors, setErrors] = useState<{
    event?: string;
    destination?: string;
    email?: string;
    targetUrl?: string;
    createdBy?: string;
    company?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = '/api/v1/settings/global-webhooks';

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
    }
  }, [editingWebhook]);

  const validateForm = () => {
    const newErrors: { event?: string; destination?: string; email?: string; targetUrl?: string; createdBy?: string; company?: string } = {};
    if (!formData.event) {
      newErrors.event = 'Event is required';
    } else if (
      !editingWebhook &&
      webhooks.some((w) => w.event === formData.event)
    ) {
      newErrors.event = `Event "${formData.event}" already has a webhook`;
    }
    if (!formData.destination) {
      newErrors.destination = 'Destination is required';
    }
    if (formData.destination === 'EMAIL' || formData.destination === 'BOTH') {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'A valid email is required for Email or Both destinations';
      }
    }
    if (formData.destination === 'TARGET_URL' || formData.destination === 'BOTH') {
      if (!formData.targetUrl) {
        newErrors.targetUrl = 'Target URL is required for Target URL or Both destinations';
      } else {
        try {
          new URL(formData.targetUrl);
        } catch {
          newErrors.targetUrl = 'Invalid URL format';
        }
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

    const payload: GlobalWebhook = {
      id: editingWebhook ? editingWebhook.id : 0,
      userId: 1,
      event: formData.event,
      dataTypeEnabled: formData.dataTypeEnabled,
      destination: formData.destination as 'TARGET_URL' | 'EMAIL' | 'BOTH',
      email: formData.email.trim(),
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
      toast.success(`Global webhook ${editingWebhook ? 'updated' : 'created'} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
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
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Global Webhooks API route not found. Please check the server configuration.'
          : err.response?.status === 405
          ? 'Method not allowed. Please check the API configuration.'
          : err.response?.data?.message || err.message || `Failed to ${editingWebhook ? 'update' : 'create'} global webhook`;
      console.error('API error:', err, {
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(message);
      if (message.includes('Duplicate entry') && message.includes('for key')) {
        const eventMatch = message.match(/Duplicate entry '([^']+)' for key/);
        const event = eventMatch ? eventMatch[1] : formData.event;
        toast.error(`Global webhook for event "${event}" already exists`, {
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

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {editingWebhook ? 'Edit Global Webhook' : 'Add a new global webhook'}
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
          <Label className="text-sm font-medium text-gray-700">Data Type</Label>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="customer-info"
                checked={formData.dataTypeEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, dataTypeEnabled: checked as boolean })}
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-500"
              />
              <Label htmlFor="customer-info" className="text-sm text-gray-700">
                Customer Info
              </Label>
            </div>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Data Destination *</Label>
          <Select
            value={formData.destination}
            onValueChange={(value) => {
              setFormData({ ...formData, destination: value as 'TARGET_URL' | 'EMAIL' | 'BOTH' });
              setErrors((prev) => ({ ...prev, destination: '' }));
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.destination ? 'border-red-500' : ''}`}>
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
          {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email {(formData.destination === 'EMAIL' || formData.destination === 'BOTH') && '*'}</Label>
          <Input
            id="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrors((prev) => ({ ...prev, email: '' }));
            }}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter email (e.g., test@example.com)"
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="targetUrl" className="text-sm font-medium text-gray-700">Target URL {(formData.destination === 'TARGET_URL' || formData.destination === 'BOTH') && '*'}</Label>
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
            placeholder="Enter company name (e.g., Example Corp)"
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

export default AddGlobalWebhookForm;
