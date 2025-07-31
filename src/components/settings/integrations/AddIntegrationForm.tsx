"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { toast } from 'react-toastify';

interface Integration {
  id: number;
  userId: number;
  service: 'ZAPIER' | 'DRIFT';
  website: string;
  apiKey: string;
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddIntegrationFormProps {
  onSave: () => void;
  onCancel: () => void;
  editingIntegration: Integration | null;
}

const AddIntegrationForm: React.FC<AddIntegrationFormProps> = ({ onSave, onCancel, editingIntegration }) => {
  const [formData, setFormData] = useState({
    service: '' as 'ZAPIER' | 'DRIFT' | '',
    website: '',
    apiKey: '',
    isConfigured: false,
  });

  const serviceOptions = ['ZAPIER', 'DRIFT'];

  // Initialize form with editing data
  useEffect(() => {
    if (editingIntegration) {
      setFormData({
        service: editingIntegration.service,
        website: editingIntegration.website,
        apiKey: editingIntegration.apiKey,
        isConfigured: editingIntegration.isConfigured,
      });
    }
  }, [editingIntegration]);

  const validateForm = () => {
    if (!formData.service) {
      return 'Service is required.';
    }
    if (!formData.website || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
      return 'A valid website URL is required.';
    }
    if (!formData.apiKey || formData.apiKey.length < 10) {
      return 'A valid API key is required (minimum 10 characters).';
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

    const payload: Integration = {
      id: editingIntegration ? editingIntegration.id : Date.now(), // Temporary ID for new integrations
      userId: 1,
      service: formData.service as 'ZAPIER' | 'DRIFT',
      website: formData.website,
      apiKey: formData.apiKey,
      isConfigured: formData.isConfigured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingIntegration) {
        await axios.put('https://zotly.onrender.com/api/v1/settings/integrations', payload);
        toast.success('Integration updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const response = await axios.post<Integration>('https://zotly.onrender.com/api/v1/settings/integrations', payload);
        payload.id = response.data.id; // Use server-generated ID
        toast.success('Integration created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      onSave();
      setFormData({
        service: '',
        website: '',
        apiKey: '',
        isConfigured: false,
      });
    } catch (err) {
      toast.error('Failed to save integration. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {editingIntegration ? 'Edit Integration' : 'Add a new integration'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="service" className="text-sm font-medium text-gray-700">
            Service
          </Label>
          <Select
            value={formData.service}
            onValueChange={(value) => setFormData({ ...formData, service: value as 'ZAPIER' | 'DRIFT' })}
          >
            <SelectTrigger className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {serviceOptions.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Website
          </Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter website (e.g., https://example.com)"
          />
        </div>
        <div>
          <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
            API Key
          </Label>
          <Input
            id="apiKey"
            value={formData.apiKey}
            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter API key (e.g., abc123xyz)"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isConfigured"
            checked={formData.isConfigured}
            onCheckedChange={(checked) => setFormData({ ...formData, isConfigured: checked as boolean })}
          />
          <Label htmlFor="isConfigured" className="text-sm font-medium text-gray-700">
            Configured
          </Label>
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
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddIntegrationForm;