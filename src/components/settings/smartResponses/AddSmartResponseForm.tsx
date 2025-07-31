"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { toast } from 'react-toastify';

interface SmartResponse {
  id: number;
  userId: number;
  response: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  shortcuts: string[];
  websites: string[];
}

interface AddSmartResponseFormProps {
  onSave: (smartResponse: SmartResponse) => void;
  onCancel: () => void;
  editingResponse: SmartResponse | null;
}

const AddSmartResponseForm: React.FC<AddSmartResponseFormProps> = ({ onSave, onCancel, editingResponse }) => {
  const [formData, setFormData] = useState({
    shortcuts: '',
    response: '',
    createdBy: '',
    company: '',
    websites: [] as string[],
  });
  const [existingShortcuts, setExistingShortcuts] = useState<Map<number, Set<string>>>(new Map());

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

  // Fetch existing smart responses to validate shortcuts
  useEffect(() => {
    const fetchSmartResponses = async () => {
      try {
        const response = await axios.get<SmartResponse[]>(
          'https://zotly.onrender.com/api/v1/settings/smart-responses'
        );
        const shortcutMap = new Map<number, Set<string>>();
        response.data.forEach((sr) => {
          shortcutMap.set(sr.id, new Set(sr.shortcuts));
        });
        setExistingShortcuts(shortcutMap);
      } catch (err) {
        toast.error('Failed to fetch existing shortcuts for validation.', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error(err);
      }
    };

    fetchSmartResponses();
  }, []);

  // Initialize form with editing data
  useEffect(() => {
    if (editingResponse) {
      setFormData({
        shortcuts: editingResponse.shortcuts.join(', '),
        response: editingResponse.response,
        createdBy: editingResponse.createdBy,
        company: editingResponse.company,
        websites: editingResponse.websites,
      });
    }
  }, [editingResponse]);

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

  const validateShortcuts = (shortcuts: string[], currentId: number | null) => {
    const newShortcuts = shortcuts.map((s) => s.trim().toLowerCase());
    for (const [id, shortcutsSet] of existingShortcuts) {
      if (currentId !== null && id === currentId) continue; // Skip validation for the same response when editing
      for (const shortcut of newShortcuts) {
        if (shortcutsSet.has(shortcut)) {
          return `Shortcut "${shortcut}" is already used in another smart response.`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const shortcuts = formData.shortcuts.split(',').map((s) => s.trim()).filter((s) => s);
    const validationError = validateShortcuts(shortcuts, editingResponse ? editingResponse.id : null);
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const payload: SmartResponse = {
      id: editingResponse ? editingResponse.id : Date.now(), // Temporary ID for new responses
      userId: 1,
      response: formData.response,
      createdBy: formData.createdBy,
      company: formData.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shortcuts,
      websites: formData.websites,
    };

    try {
      if (editingResponse) {
        // Update existing response
        await axios.put('https://zotly.onrender.com/api/v1/settings/smart-responses', payload);
        toast.success('Smart response updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        // Create new response
        const response = await axios.post<SmartResponse>('https://zotly.onrender.com/api/v1/settings/smart-responses', payload);
        payload.id = response.data.id; // Use server-generated ID
        toast.success('Smart response created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      onSave(payload);
      setFormData({
        shortcuts: '',
        response: '',
        createdBy: '',
        company: '',
        websites: [],
      });
    } catch (err) {
      toast.error('Failed to save smart response. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {editingResponse ? 'Edit Smart Response' : 'Add a new smart response'}
      </h1>
      <hr className="mb-10 font-bold" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="-mt-10">Smart response</label>
        <p className="text-sm text-gray-600">
          Smart responses are pre-made messages you can recall easily during chat.
        </p>
        <div>
          <Label htmlFor="shortcuts" className="text-sm font-medium text-gray-700">
            Shortcuts
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
          <div className="mt-2 flex flex-wrap gap-2">
            {variables.map((variable) => (
              <Button
                key={variable}
                type="button"
                variant="outline"
                className="text-sm"
                onClick={() => handleVariableClick(variable)}
              >
                {variable}
              </Button>
            ))}
          </div>
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
        <div>
          <Label className="text-sm font-medium text-gray-700">Websites</Label>
          <div className="mt-2 space-y-2">
            {websiteOptions.map((website) => (
              <div key={website} className="flex items-center gap-2">
                <Checkbox
                  id={website}
                  checked={formData.websites.includes(website)}
                  onCheckedChange={(checked) => handleWebsiteChange(website, checked as boolean)}
                />
                <label htmlFor={website} className="text-sm">{website}</label>
              </div>
            ))}
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

export default AddSmartResponseForm;