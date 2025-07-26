
"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

interface GlobalWebhook {
  id: number;
  event: string;
  dataType: boolean;
  destination: string;
}

interface AddGlobalWebhookFormProps {
  onSave: (globalWebhook: GlobalWebhook) => void;
  onCancel: () => void;
}

const AddGlobalWebhookForm: React.FC<AddGlobalWebhookFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    event: '',
    dataType: false,
    destination: '',
  });

  const eventOptions = [
    'New customer',
    'New employee',
    'Restore password',
    'New invoice',
    'New payment',
  ];

  const destinationOptions = ['Target URL', 'Email', 'Both'];

  const handleEventSelect = (event: string) => {
    setFormData((prev) => ({
      ...prev,
      event,
    }));
  };

  const handleDataTypeChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dataType: checked,
    }));
  };

  const handleDestinationChange = (destination: string) => {
    setFormData((prev) => ({
      ...prev,
      destination,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      event: formData.event,
      dataType: formData.dataType,
      destination: formData.destination,
    });
    setFormData({
      event: '',
      dataType: false,
      destination: '',
    });
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Add a new global webhook</h1>
      <hr className="border-gray-300 mb-6" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">Event</Label>
          <RadioGroup
            value={formData.event}
            onValueChange={handleEventSelect}
            className="mt-2 space-y-2"
          >
            {eventOptions.map((event) => (
              <div key={event} className="flex items-center gap-2">
                <RadioGroupItem value={event} id={event} />
                <Label htmlFor={event} className="text-sm text-gray-700">
                  {event}
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
                checked={formData.dataType}
                onCheckedChange={handleDataTypeChange}
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
            onValueChange={handleDestinationChange}
          >
            <SelectTrigger className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {destinationOptions.map((destination) => (
                <SelectItem key={destination} value={destination}>
                  {destination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
