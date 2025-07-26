
"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Globe } from 'lucide-react';

interface Webhook {
  id: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
}

interface AddWebhookFormProps {
  onSave: (webhook: Webhook) => void;
  onCancel: () => void;
}

const AddWebhookForm: React.FC<AddWebhookFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    event: '',
    dataTypes: [] as string[],
    targetUrl: '',
  });

  const eventOptions = [
    'Chat starts',
    'Support chat starts',
    'Chat converted to lead',
    'Chat activates/verify website',
  ];

  const dataTypeOptions = [
    'Visitor Info',
    'Chat Info',
    'Location Info',
    'Technology Info',
    'Security Info',
    'Custom Fields',
  ];

  const handleEventSelect = (event: string) => {
    setFormData((prev) => ({
      ...prev,
      event,
    }));
  };

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      dataTypes: checked
        ? [...prev.dataTypes, dataType]
        : prev.dataTypes.filter((d) => d !== dataType),
    }));
  };

  const handleTargetUrlChange = (targetUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      targetUrl,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      event: formData.event,
      dataTypes: formData.dataTypes,
      targetUrl: formData.targetUrl,
    });
    setFormData({
      event: '',
      dataTypes: [],
      targetUrl: '',
    });
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new webhook</h1>
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
          <div className="relative mt-2">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              id="targetUrl"
              value={formData.targetUrl}
              onChange={(e) => handleTargetUrlChange(e.target.value)}
              className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter target URL"
            />
          </div>
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
