
"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';

interface QueuedMessage {
  id: number;
  title: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  image?: string;
}

interface AddQueuedMessageFormProps {
  onSave: (queuedMessage: QueuedMessage) => void;
  onCancel: () => void;
}

const AddQueuedMessageForm: React.FC<AddQueuedMessageFormProps> = ({ onSave, onCancel }) => {
  const [messageText, setMessageText] = useState('');

  const handleVariableClick = (variable: string) => {
    setMessageText((prev) => prev + variable);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      title: '', // Not used
      text: messageText,
      backgroundColor: '#ffffff', // Default
      textColor: '#000000', // Default
      image: undefined, // Not used
    });
    setMessageText('');
    onCancel();
  };

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

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new queued message</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-600">
          When all agents hit their limit or routing is set to manual new visitors will be queued. And we will show a message.
        </p>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Queued message</h2>
          <Input
            id="message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="insert text here..."
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
