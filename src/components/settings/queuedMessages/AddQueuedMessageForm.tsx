"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'react-toastify';
import { useUserStore } from '@/stores/useUserStore';

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
  theme?: string;
}

const AddQueuedMessageForm: React.FC<AddQueuedMessageFormProps> = ({ 
  onSave, 
  onCancel, 
  editingMessage,
  theme = 'light'
}) => {
  const {user} = useUserStore()
  const [formData, setFormData] = useState<Omit<QueuedMessage, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { 
    id?: number;
    imageUrl: string;
  }>({
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

  useEffect(() => {
    if (editingMessage) {
      setFormData({
        id: editingMessage.id,
        message: editingMessage.message,
        backgroundColor: editingMessage.backgroundColor,
        textColor: editingMessage.textColor,
        imageUrl: editingMessage.imageUrl || '',
        createdBy: editingMessage.createdBy,
        company: editingMessage.company,
      });
    } else {
      setFormData({
        message: '',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        imageUrl: '',
        createdBy: '',
        company: '',
      });
    }
  }, [editingMessage]);

  const handleVariableClick = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      message: prev.message + variable,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: QueuedMessage = {
      id: formData.id || Date.now(),
      userId: user?.id??0,
      message: formData.message,
      backgroundColor: formData.backgroundColor,
      textColor: formData.textColor,
      imageUrl: formData.imageUrl || undefined,
      createdBy: formData.createdBy,
      company: formData.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);
  };

  return (
    <div className={`p-10 rounded-xl shadow-lg border ${
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <h1 className={`text-2xl font-semibold text-gray-800 dark:text-white ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        {editingMessage ? 'Edit Queued Message' : 'Add a new queued message'}
      </h1>
      
      <p className={`text-sm ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>
        When all agents hit their limit or routing is set to manual, new visitors will be queued.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Queued message
          </h2>
          
          <Label htmlFor="message" className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Message
          </Label>
          <Input
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={`w-full mt-2 focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300'
            }`}
            placeholder="Insert text here..."
            required
          />

          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className={`px-3 py-1 text-sm ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700'
              }`}
              onClick={() => handleVariableClick('%number%')}
            >
              +number
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`px-3 py-1 text-sm ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700'
              }`}
              onClick={() => handleVariableClick('%minutes%')}
            >
              +minutes
            </Button>
          </div>

          <div className="mt-4">
            <Label className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Available variables:
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {variables.map((variable) => (
                <Button
                  key={variable}
                  type="button"
                  variant="outline"
                  className={`px-3 py-1 text-sm ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => handleVariableClick(variable)}
                >
                  {variable}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="backgroundColor" className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Background Color
          </Label>
          <Input
            id="backgroundColor"
            type="color"
            value={formData.backgroundColor}
            onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
            className="w-full mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="textColor" className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Text Color
          </Label>
          <Input
            id="textColor"
            type="color"
            value={formData.textColor}
            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
            className="w-full mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="imageUrl" className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Image URL (Optional)
          </Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className={`w-full mt-2 focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300'
            }`}
            placeholder="Enter image URL (e.g., http://example.com/image.png)"
          />
        </div>

        <div>
          <Label htmlFor="createdBy" className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Created By
          </Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className={`w-full mt-2 focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300'
            }`}
            placeholder="Enter creator name"
            required
          />
        </div>

        <div>
          <Label htmlFor="company" className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Company
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={`w-full mt-2 focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'border-gray-300'
            }`}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
    {/* Cancel Button (secondary) */}
<Button
  type="button"
  variant="outline"
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark'
      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
      : 'border-gray-300 text-gray-800 hover:bg-gray-100'
  }`}
  onClick={onCancel}
>
  Cancel
</Button>

{/* Save Button (primary) */}
<Button
  type="submit"
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-blue-600 hover:bg-blue-700'
  } text-white`}
>
  Save
</Button>
        </div>
      </form>
    </div>
  );
};

export default AddQueuedMessageForm;