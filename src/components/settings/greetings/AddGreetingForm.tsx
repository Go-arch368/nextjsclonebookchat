"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { MessageSquare, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUserStore } from '@/stores/useUserStore';

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
  const {user} = useUserStore()
  const [formData, setFormData] = useState<Greeting>({
    title: initialGreeting?.title || '',
    greeting: initialGreeting?.greeting || '',
    type: initialGreeting?.type || 'All_Visitors',
    visible: initialGreeting?.visible !== undefined ? initialGreeting.visible : true,
  });
  const [errors, setErrors] = useState<{ title?: string; greeting?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) {
      console.error('onSave is not defined');
      toast.error('Error: Save functionality is not available', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: initialGreeting?.id,
        userId: user?.id ?? 0,
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
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save greeting';
      console.error('Submit error:', errorMessage, err);
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('for key \'title\'')) {
        const titleMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'title'/);
        const title = titleMatch ? titleMatch[1] : formData.title;
        toast.error(`Greeting with title '${title}' already exists`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          {initialGreeting ? 'Edit Greeting' : 'Add New Greeting'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="title"
                className={`pl-10 ${errors.title ? 'border-red-500' : ''}`}
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="Enter greeting title"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
          </div>

          {/* Greeting Type */}
          <div className="space-y-2">
            <Label>Greeting Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All_Visitors">All Visitors</SelectItem>
                <SelectItem value="Returning_Visitors">Returning Visitors</SelectItem>
                <SelectItem value="First_Time_Visitors">First Time Visitors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Greeting Message */}
          <div className="space-y-2">
            <Label>Greeting Message</Label>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Button
                  key={variable}
                  type="button"
                  variant="outline"
                  className="h-8 px-3 text-xs"
                  onClick={() => insertVariable(variable)}
                >
                  {variable}
                </Button>
              ))}
            </div>
            <Textarea
              ref={textareaRef}
              className={`min-h-[150px] ${errors.greeting ? 'border-red-500' : ''}`}
              value={formData.greeting}
              onChange={(e) => {
                setFormData({ ...formData, greeting: e.target.value });
                setErrors((prev) => ({ ...prev, greeting: '' }));
              }}
              placeholder="Enter greeting message"
            />
            {errors.greeting && <p className="text-red-500 text-sm">{errors.greeting}</p>}
            <p className="text-sm text-gray-500">
              Set the default greeting message. Use variables to personalize the greeting.
            </p>
          </div>

          {/* Visibility */}
          <div className="flex items-center space-x-2">
            <Input
              id="visible"
              type="checkbox"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="visible">Make this greeting visible</Label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isSubmitting || !onSave}
            >
              {isSubmitting ? 'Saving...' : 'Save Greeting'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGreetingForm;