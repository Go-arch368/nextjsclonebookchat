"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

interface QueuedMessage {
  id: number;
  userId: number;
  message: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface AddQueuedMessageFormProps {
  onSave: (queuedMessage: QueuedMessage) => void;
  onCancel: () => void;
  initialMessage: QueuedMessage | null;
  setError: (error: string | null) => void;
}

const AddQueuedMessageForm: React.FC<AddQueuedMessageFormProps> = ({
  onSave,
  onCancel,
  initialMessage,
  setError,
}) => {
  const [formData, setFormData] = useState<QueuedMessage>({
    id: initialMessage?.id || 0,
    userId: 1,
    message: initialMessage?.message || '',
    backgroundColor: initialMessage?.backgroundColor || '#FFFFFF',
    textColor: initialMessage?.textColor || '#000000',
    imageUrl: initialMessage?.imageUrl || '',
    createdBy: initialMessage?.createdBy || '',
    company: initialMessage?.company || '',
    createdAt: initialMessage?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [errors, setErrors] = useState<{ message?: string; createdBy?: string; company?: string }>({});
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
    '%number%',
    '%minutes%',
  ];

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = formData.message.slice(0, start) + variable + formData.message.slice(end);
      setFormData({ ...formData, message: newValue });
      setErrors((prev) => ({ ...prev, message: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { message?: string; createdBy?: string; company?: string } = {};
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
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
        ...formData,
        id: initialMessage?.id || 0,
        userId: 1,
        createdAt: initialMessage?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setFormData({
        id: 0,
        userId: 1,
        message: '',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        imageUrl: '',
        createdBy: '',
        company: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setErrors({});
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save queued message';
      console.error('Submit error:', errorMessage, err);
      setError(errorMessage);
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('for key \'message\'')) {
        const messageMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'message'/);
        const message = messageMatch ? messageMatch[1] : formData.message;
        toast.error(`Queued message "${message}" already exists`, {
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
      onCancel();
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {initialMessage ? 'Edit Queued Message' : 'Add a new queued message'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <p className="text-sm text-gray-600">
          When all agents hit their limit or routing is set to manual, new visitors will be queued, and we will show a message.
        </p>
        <div className="p-4">
          <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
          <div className="relative mt-2">
            <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-500" />
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                setErrors((prev) => ({ ...prev, message: '' }));
              }}
              className={`w-full min-h-[150px] pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-500' : ''}`}
              placeholder="Enter queued message"
              ref={textareaRef}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
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
          <p className="text-sm text-gray-500 mt-2">
            Set the default queued message. Use variables to personalize the message.
          </p>
        </div>
        <div className="p-4">
          <Label htmlFor="backgroundColor" className="text-sm font-medium text-gray-700">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={formData.backgroundColor}
            onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="p-4">
          <Label htmlFor="textColor" className="text-sm font-medium text-gray-700">Text Color</Label>
          <Input
            id="textColor"
            type="color"
            value={formData.textColor}
            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="p-4">
          <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">Image URL (Optional)</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image URL (e.g., http://example.com/image.png)"
          />
        </div>
        <div className="p-4">
          <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">Created By</Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => {
              setFormData({ ...formData, createdBy: e.target.value });
              setErrors((prev) => ({ ...prev, createdBy: '' }));
            }}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.createdBy ? 'border-red-500' : ''}`}
            placeholder="Enter creator name (e.g., admin)"
          />
          {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
        </div>
        <div className="p-4">
          <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => {
              setFormData({ ...formData, company: e.target.value });
              setErrors((prev) => ({ ...prev, company: '' }));
            }}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-500' : ''}`}
            placeholder="Enter company name (e.g., Example Corp)"
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddQueuedMessageForm;