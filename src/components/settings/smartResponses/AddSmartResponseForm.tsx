
"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Checkbox } from '@/ui/checkbox';

interface SmartResponse {
  id: number;
  shortcuts: string[];
  response: string;
  websites: string[];
}

interface AddSmartResponseFormProps {
  onSave: (smartResponse: SmartResponse) => void;
  onCancel: () => void;
}

const AddSmartResponseForm: React.FC<AddSmartResponseFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    shortcuts: '',
    response: '',
    websites: [] as string[],
  });

  const websiteOptions = [
    'http://test-zotly-to-drift-flow.com',
    'https://drift.com',
    'https://testbug.com',
  ];

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

  const handleVariableClick = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      response: prev.response + variable,
    }));
  };

  const handleWebsiteChange = (website: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      websites: checked
        ? [...prev.websites, website]
        : prev.websites.filter((w) => w !== website),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      shortcuts: formData.shortcuts.split(',').map((s) => s.trim()).filter((s) => s),
      response: formData.response,
      websites: formData.websites,
    });
    setFormData({
      shortcuts: '',
      response: '',
      websites: [],
    });
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new smart response</h1>
      <hr className="mb-10 font-bold" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className='-mt-10'>Smart response</label>
        <p className="text-sm text-gray-600">
          Smart responses are pre-made messages you can recall easily during chat.
        </p>
        <div>
          <Label htmlFor="shortcuts" className="text-sm font-medium text-gray-700">
            ShortCuts
          </Label>
          <Input
            id="shortcuts"
            value={formData.shortcuts}
            onChange={(e) => setFormData({ ...formData, shortcuts: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter shortcuts (comma-separated, e.g., hi, hello, hey)"
          />
          <p className="text-xs text-gray-500 mt-1">
            To use a canned response during a chat, type in # and a shortcut.
          </p>
        </div>
        <div>
          <Label htmlFor="response" className="text-sm font-medium text-gray-700">
            Response
          </Label>
          <Input
            id="response"
            value={formData.response}
            onChange={(e) => setFormData({ ...formData, response: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 h-20"
            placeholder="Enter response message"
          />
         
        </div>
        <div>
          <Label htmlFor="websites" className="text-sm font-medium text-gray-700 ">
            webSites
          </Label>
          <Select
            value=""
            onValueChange={() => {}} 
            
          >
            <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select websites" />
            </SelectTrigger>
            <SelectContent>
              {websiteOptions.map((website) => (
                <div key={website} className="flex items-center gap-2 p-2">
                  <Checkbox
                    id={website}
                    checked={formData.websites.includes(website)}
                    onCheckedChange={(checked) => handleWebsiteChange(website, checked as boolean)}
                  />
                  <label htmlFor={website} className="text-sm">
                    {website}
                  </label>
                </div>
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

export default AddSmartResponseForm;
