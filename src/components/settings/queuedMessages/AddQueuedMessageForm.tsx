"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
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
  editingMessage: QueuedMessage | null;
}

const AddQueuedMessageForm: React.FC<AddQueuedMessageFormProps> = ({ onSave, onCancel, editingMessage }) => {
  const [formData, setFormData] = useState({
    message: '',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    imageUrl: '',
    createdBy: '',
    company: '',
  });

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

  // Initialize form with editing data
  useEffect(() => {
    if (editingMessage) {
      setFormData({
        message: editingMessage.message,
        backgroundColor: editingMessage.backgroundColor,
        textColor: editingMessage.textColor,
        imageUrl: editingMessage.imageUrl || '',
        createdBy: editingMessage.createdBy,
        company: editingMessage.company,
      });
    }
  }, [editingMessage]);

  const handleVariableClick = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      message: prev.message + variable,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: QueuedMessage = {
      id: editingMessage ? editingMessage.id : Date.now(), // Temporary ID for new messages
      userId: 1,
      message: formData.message,
      backgroundColor: formData.backgroundColor,
      textColor: formData.textColor,
      imageUrl: formData.imageUrl || undefined,
      createdBy: formData.createdBy,
      company: formData.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingMessage) {
        // Update existing message
        await axios.put('https://zotly.onrender.com/api/v1/settings/queued-messages', payload);
        toast.success('Queued message updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        // Create new message
        const response = await axios.post<QueuedMessage>('https://zotly.onrender.com/api/v1/settings/queued-messages', payload);
        payload.id = response.data.id; // Use server-generated ID
        toast.success('Queued message created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      onSave(payload);
      setFormData({
        message: '',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        imageUrl: '',
        createdBy: '',
        company: '',
      });
    } catch (err) {
      toast.error('Failed to save queued message. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {editingMessage ? 'Edit Queued Message' : 'Add a new queued message'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-600">
          When all agents hit their limit or routing is set to manual new visitors will be queued. And we will show a message.
        </p>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Queued message</h2>
          <Label htmlFor="message" className="text-sm font-medium text-gray-700">
            Message
          </Label>
          <Input
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Insert text here..."
          />
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1 text-sm border-gray-300 text-gray-700"
              onClick={() => handleVariableClick('%number%')}
            >
              +number
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-3 py-1 text-sm border-gray-300 text-gray-700"
              onClick={() => handleVariableClick('%minutes%')}
            >
              +minutes
            </Button>
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700">Available variables:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {variables.map((variable) => (
                <Button
                  key={variable}
                  type="button"
                  variant="outline"
                  className="px-3 py-1 text-sm border-gray-300 text-gray-700"
                  onClick={() => handleVariableClick(variable)}
                >
                  {variable}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="backgroundColor" className="text-sm font-medium text-gray-700">
            Background Color
          </Label>
          <Input
            id="backgroundColor"
            type="color"
            value={formData.backgroundColor}
            onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="textColor" className="text-sm font-medium text-gray-700">
            Text Color
          </Label>
          <Input
            id="textColor"
            type="color"
            value={formData.textColor}
            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
            Image URL (Optional)
          </Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image URL (e.g., http://example.com/image.png)"
          />
        </div>
        <div>
          <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">
            Created By
          </Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter creator name (e.g., admin)"
          />
        </div>
        <div>
          <Label htmlFor="company" className="text-sm font-medium text-gray-700">
            Company
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter company name (e.g., Example Corp)"
          />
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

export default AddQueuedMessageForm;