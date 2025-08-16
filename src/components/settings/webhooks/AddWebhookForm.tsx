"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { useTheme } from 'next-themes';

interface Webhook {
  id?: number;
  userId?: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt?: string;
  updatedAt?: string;
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
  const [formData, setFormData] = useState<Webhook>({
    event: '',
    dataTypes: [],
    targetUrl: '',
    createdBy: '',
    company: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  const eventOptions = [
    'CHAT_STARTS',
  ];

  const dataTypeOptions = ['Visitor Info', 'Chat Info', 'Message Content'];

  useEffect(() => {
    if (editingWebhook) {
      setFormData({
        id: editingWebhook.id,
        userId: editingWebhook.userId,
        event: editingWebhook.event,
        dataTypes: editingWebhook.dataTypes || [],
        targetUrl: editingWebhook.targetUrl,
        createdBy: editingWebhook.createdBy,
        company: editingWebhook.company,
        createdAt: editingWebhook.createdAt,
        updatedAt: editingWebhook.updatedAt,
      });
    }
  }, [editingWebhook]);

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
      await onSave(formData);
    } catch (error: unknown) {
      console.error('Error saving webhook:', error);
      const message = error instanceof Error ? error.message : 'Failed to save webhook';
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-10 rounded-xl shadow-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {editingWebhook ? 'Edit Webhook' : 'Add New Webhook'}
      </h1>
      <hr className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} mb-6`} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
            {errors.submit}
          </p>
        )}

        <div>
          <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Event *
          </Label>
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
                <Label 
                  htmlFor={event} 
                  className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {event.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.event && (
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              {errors.event}
            </p>
          )}
        </div>

        <div>
          <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Data Types *
          </Label>
          <div className="mt-2 space-y-2">
            {dataTypeOptions.map((dataType) => (
              <div key={dataType} className="flex items-center gap-2">
                <Checkbox
                  id={dataType}
                  checked={formData.dataTypes.includes(dataType)}
                  onCheckedChange={(checked) => handleDataTypeChange(dataType, checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label 
                  htmlFor={dataType} 
                  className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {dataType}
                </Label>
              </div>
            ))}
          </div>
          {errors.dataTypes && (
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              {errors.dataTypes}
            </p>
          )}
        </div>

        <div>
          <Label 
            htmlFor="targetUrl" 
            className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Target URL *
          </Label>
          <Input
            id="targetUrl"
            value={formData.targetUrl}
            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''} ${
              errors.targetUrl ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : 'border-gray-300'
            }`}
            placeholder="https://example.com/webhook"
            disabled={isSubmitting}
          />
          {errors.targetUrl && (
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              {errors.targetUrl}
            </p>
          )}
        </div>

        <div>
          <Label 
            htmlFor="createdBy" 
            className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Created By *
          </Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''} ${
              errors.createdBy ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : 'border-gray-300'
            }`}
            placeholder="admin"
            disabled={isSubmitting}
          />
          {errors.createdBy && (
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              {errors.createdBy}
            </p>
          )}
        </div>

        <div>
          <Label 
            htmlFor="company" 
            className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Company *
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''} ${
              errors.company ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : 'border-gray-300'
            }`}
            placeholder="Your Company"
            disabled={isSubmitting}
          />
          {errors.company && (
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              {errors.company}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className={theme === 'dark' ? 'border-gray-700' : ''}
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