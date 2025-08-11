
"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { Textarea } from '@/ui/textarea';
import { toast } from 'react-toastify';
import { SmartResponse } from './SmartResponsesView';

interface AddSmartResponseFormProps {
  onSave: (response: SmartResponse) => void;
  onCancel: () => void;
  editingResponse: SmartResponse | null;
  smartResponses: SmartResponse[];
}

const AddSmartResponseForm: React.FC<AddSmartResponseFormProps> = ({
  onSave,
  onCancel,
  editingResponse,
  smartResponses,
}) => {
  const [formData, setFormData] = useState({
    shortcuts: '',
    response: '',
    createdBy: '',
    company: '',
    websites: [] as string[],
  });
  const [errors, setErrors] = useState<{
    shortcuts?: string;
    response?: string;
    createdBy?: string;
    company?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const websiteOptions = [
    'http://test-zotly-to-drift-flow.com',
    'https://drift.com',
    'https://testbug.com',
    'https://example.com',
    'https://test.com',
    'https://chatmetrics.com',
    'https://techska.com',
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
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = formData.response.slice(0, start) + variable + formData.response.slice(end);
      setFormData((prev) => ({ ...prev, response: newValue }));
      setErrors((prev) => ({ ...prev, response: '' }));
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleWebsiteChange = (website: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      websites: checked ? [...prev.websites, website] : prev.websites.filter((w) => w !== website),
    }));
  };

  const validateForm = () => {
    const newErrors: { shortcuts?: string; response?: string; createdBy?: string; company?: string } = {};
    const shortcuts = formData.shortcuts.split(',').map((s) => s.trim()).filter((s) => s);

    if (shortcuts.length === 0) {
      newErrors.shortcuts = 'At least one shortcut is required';
    } else {
      const unique = new Set(shortcuts.map((s) => s.toLowerCase()));
      if (unique.size !== shortcuts.length) {
        newErrors.shortcuts = 'Duplicate shortcuts found';
      } else {
        for (const response of smartResponses) {
          if (editingResponse && response.id === editingResponse.id) continue;
          if (response.shortcuts.some((s) => shortcuts.includes(s))) {
            newErrors.shortcuts = `Shortcut "${shortcuts.find((s) => response.shortcuts.includes(s))}" already exists`;
          }
        }
      }
    }

    if (!formData.response.trim()) {
      newErrors.response = 'Response is required';
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
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const shortcuts = formData.shortcuts.split(',').map((s) => s.trim()).filter((s) => s);
    const payload: SmartResponse = {
      id: editingResponse?.id || 0,
      userId: 1,
      response: formData.response.trim(),
      shortcuts,
      websites: formData.websites,
      createdBy: formData.createdBy.trim(),
      company: formData.company.trim(),
      createdAt: editingResponse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const url = '/api/v1/settings/smart-responses';
      const response = await axios({
        method: editingResponse ? 'PUT' : 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: payload,
      });

      onSave(response.data);
      toast.success(`Smart response ${editingResponse ? 'updated' : 'created'} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      onCancel();
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Smart responses API route not found. Please check the server configuration.'
          : err.response?.status === 405
          ? 'Method not allowed. Please check the API configuration.'
          : err.response?.data?.message || err.message || `Failed to ${editingResponse ? 'update' : 'create'} smart response`;
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('API error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {editingResponse ? 'Edit Smart Response' : 'Add New Smart Response'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="shortcuts" className="text-sm font-medium text-gray-700">Shortcuts *</Label>
          <Input
            id="shortcuts"
            value={formData.shortcuts}
            onChange={(e) => {
              setFormData({ ...formData, shortcuts: e.target.value });
              setErrors((prev) => ({ ...prev, shortcuts: '' }));
            }}
            placeholder="Comma separated shortcuts (e.g., thanks, inquiry)"
            className={errors.shortcuts ? 'border-red-500' : 'border-gray-300'}
          />
          {errors.shortcuts && <p className="text-red-500 text-sm mt-1">{errors.shortcuts}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Use #shortcut during chat to trigger this response
          </p>
        </div>

        <div>
          <Label htmlFor="response" className="text-sm font-medium text-gray-700 mb-2">Response *</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {variables.map((variable) => (
              <Button
                key={variable}
                type="button"
                className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm hover:bg-gray-300"
                onClick={() => handleVariableClick(variable)}
              >
                {variable}
              </Button>
            ))}
          </div>
          <Textarea
            id="response"
            value={formData.response}
            onChange={(e) => {
              setFormData({ ...formData, response: e.target.value });
              setErrors((prev) => ({ ...prev, response: '' }));
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            className={`w-full min-h-[100px] border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.response ? 'border-red-500' : ''}`}
            placeholder="Enter your response message (e.g., Thank you for your inquiry!)"
            ref={textareaRef}
          />
          {errors.response && <p className="text-red-500 text-sm mt-1">{errors.response}</p>}
        </div>

        <div>
          <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">Created By *</Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => {
              setFormData({ ...formData, createdBy: e.target.value });
              setErrors((prev) => ({ ...prev, createdBy: '' }));
            }}
            placeholder="Enter creator name (e.g., admin)"
            className={errors.createdBy ? 'border-red-500' : 'border-gray-300'}
          />
          {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
        </div>

        <div>
          <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => {
              setFormData({ ...formData, company: e.target.value });
              setErrors((prev) => ({ ...prev, company: '' }));
            }}
            placeholder="Enter company name (e.g., ExampleCorp)"
            className={errors.company ? 'border-red-500' : 'border-gray-300'}
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">Websites</Label>
          <div className="space-y-2 mt-2">
            {websiteOptions.map((website) => (
              <div key={website} className="flex items-center gap-2">
                <Checkbox
                  id={`website-${website}`}
                  checked={formData.websites.includes(website)}
                  onCheckedChange={(checked) => handleWebsiteChange(website, checked as boolean)}
                  className="h-4 w-4 text-blue-500"
                />
                <label htmlFor={`website-${website}`} className="text-sm text-gray-700">
                  {website}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            className="px-6 py-2 border-gray-300 text-gray-800"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {editingResponse ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              editingResponse ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSmartResponseForm;
