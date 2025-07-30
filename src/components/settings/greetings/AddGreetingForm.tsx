"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { MessageSquare } from 'lucide-react';

interface Greeting {
  id?: number;
  userId?: number;
  title: string;
  greeting: string;
  type: string;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AddGreetingFormProps {
  onSave: (greeting: Greeting) => void;
  onCancel: () => void;
  initialGreeting: Greeting | null;
}

const AddGreetingForm: React.FC<AddGreetingFormProps> = ({ onSave, onCancel, initialGreeting }) => {
  const [formData, setFormData] = useState<Greeting>({
    title: initialGreeting?.title || '',
    greeting: initialGreeting?.greeting || '',
    type: initialGreeting?.type || 'All_Visitors',
    visible: initialGreeting?.visible !== undefined ? initialGreeting.visible : true,
  });
  const [errors, setErrors] = useState<{ title?: string; greeting?: string }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const variables = [
    '+Company Name',
    '+Website Domain',
    '+Visitor Continent',
    '+Visitor Country',
    '+Visitor Region',
    '+Visitor City',
    '+Visitor Language',
    '+Visitor Os Name',
    '+Visitor Browser',
  ];

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = formData.greeting.slice(0, start) + variable + formData.greeting.slice(end);
      setFormData({ ...formData, greeting: newValue });
      setErrors((prev) => ({ ...prev, greeting: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { title?: string; greeting?: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.greeting.trim()) {
      newErrors.greeting = 'Greeting is required';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) {
      console.error('onSave is not defined');
      alert('Error: Save functionality is not available');
      return;
    }
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      id: initialGreeting?.id,
      userId: 1,
      title: formData.title,
      greeting: formData.greeting,
      type: formData.type,
      visible: formData.visible,
      createdAt: initialGreeting?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setFormData({
      title: '',
      greeting: '',
      type: 'All_Visitors',
      visible: true,
    });
    setErrors({});
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {initialGreeting ? 'Edit Greeting' : 'Add a new greeting'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="p-4">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
          <div className="relative mt-2">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors((prev) => ({ ...prev, title: '' }));
              }}
              className={`w-full pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter greeting title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
        </div>

        {/* Greeting Type */}
        <div className="p-4">
          <Label htmlFor="type" className="text-sm font-medium text-gray-700 mb-2">Greeting Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="w-full rounded-full bg-gray-600 text-white focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="All Visitors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All_Visitors">All Visitors</SelectItem>
              <SelectItem value="Returning_Visitors">Returning Visitors</SelectItem>
              <SelectItem value="First_Time_Visitors">First Time Visitors</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Greeting Message */}
        <div className="p-4">
          <Label htmlFor="greeting" className="text-sm font-medium text-gray-700 mb-2">Greeting Message</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {variables.map((variable) => (
              <Button
                key={variable}
                type="button"
                className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm hover:bg-gray-300"
                onClick={() => insertVariable(variable)}
              >
                {variable}
              </Button>
            ))}
          </div>
          <Textarea
            id="greeting"
            value={formData.greeting}
            onChange={(e) => {
              setFormData({ ...formData, greeting: e.target.value });
              setErrors((prev) => ({ ...prev, greeting: '' }));
            }}
            className={`w-full min-h-[150px] border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.greeting ? 'border-red-500' : ''}`}
            placeholder="Enter greeting message"
            ref={textareaRef}
          />
          {errors.greeting && <p className="text-red-500 text-sm mt-1">{errors.greeting}</p>}
          <p className="text-sm text-gray-500 mt-2">
            Set the default greeting message. Use variables to personalize the greeting.
          </p>
        </div>

        {/* Visibility */}
        <div className="p-4">
          <Label htmlFor="visible" className="text-sm font-medium text-gray-700">Visibility</Label>
          <div className="mt-2">
            <Input
              id="visible"
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Make this greeting visible</span>
          </div>
        </div>

        {/* Save and Cancel Buttons */}
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
            disabled={!onSave}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGreetingForm;
