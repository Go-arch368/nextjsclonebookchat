"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { Textarea } from '@/ui/textarea';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      setFormData(prev => ({ ...prev, response: newValue }));
      textarea.focus();
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      }, 0);
    }
  };

  const handleWebsiteChange = (website: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      websites: checked 
        ? [...prev.websites, website] 
        : prev.websites.filter(w => w !== website),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const shortcuts = formData.shortcuts.split(',').map(s => s.trim()).filter(s => s);

    if (shortcuts.length === 0) {
      newErrors.shortcuts = 'At least one shortcut is required';
    } else {
      const existingShortcuts = smartResponses
        .filter(r => !editingResponse || r.id !== editingResponse.id)
        .flatMap(r => r.shortcuts);
      
      const duplicate = shortcuts.find(s => existingShortcuts.includes(s));
      if (duplicate) {
        newErrors.shortcuts = `Shortcut "${duplicate}" already exists`;
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 // ... (other imports and code)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);
  try {
    const shortcuts = formData.shortcuts.split(',').map(s => s.trim()).filter(s => s);
    const payload: SmartResponse = {
      id: editingResponse?.id || 0,
      userId: 1, // Replace with actual user ID from auth
      response: formData.response.trim(),
      shortcuts,
      websites: formData.websites,
      createdBy: formData.createdBy.trim(),
      company: formData.company.trim(),
      createdAt: editingResponse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);
  } catch (error: any) {
    toast.error(error.message || 'Failed to save smart response');
  } finally {
    setIsSubmitting(false);
  }
};

// ... (rest of the code)

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {editingResponse ? 'Edit Smart Response' : 'Add New Smart Response'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shortcuts Field */}
        <div>
          <Label htmlFor="shortcuts">Shortcuts *</Label>
          <Input
            id="shortcuts"
            value={formData.shortcuts}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, shortcuts: e.target.value }));
              setErrors(prev => ({ ...prev, shortcuts: '' }));
            }}
            placeholder="Comma separated shortcuts (e.g., thanks, inquiry)"
            className={errors.shortcuts ? 'border-red-500' : ''}
          />
          {errors.shortcuts && <p className="text-red-500 text-sm mt-1">{errors.shortcuts}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Use #shortcut during chat to trigger this response
          </p>
        </div>

        {/* Response Field */}
        <div>
          <Label htmlFor="response">Response *</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {variables.map(variable => (
              <Button
                key={variable}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleVariableClick(variable)}
              >
                {variable}
              </Button>
            ))}
          </div>
          <Textarea
            id="response"
            ref={textareaRef}
            value={formData.response}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, response: e.target.value }));
              setErrors(prev => ({ ...prev, response: '' }));
            }}
            className={`min-h-[150px] ${errors.response ? 'border-red-500' : ''}`}
            placeholder="Enter your response message..."
          />
          {errors.response && <p className="text-red-500 text-sm mt-1">{errors.response}</p>}
        </div>

        {/* Created By Field */}
        <div>
          <Label htmlFor="createdBy">Created By *</Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, createdBy: e.target.value }));
              setErrors(prev => ({ ...prev, createdBy: '' }));
            }}
            className={errors.createdBy ? 'border-red-500' : ''}
          />
          {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
        </div>

        {/* Company Field */}
        <div>
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, company: e.target.value }));
              setErrors(prev => ({ ...prev, company: '' }));
            }}
            className={errors.company ? 'border-red-500' : ''}
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
        </div>

        {/* Websites Field */}
        <div>
          <Label>Websites</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {websiteOptions.map(website => (
              <div key={website} className="flex items-center space-x-2">
                <Checkbox
                  id={`website-${website}`}
                  checked={formData.websites.includes(website)}
                  onCheckedChange={(checked) => handleWebsiteChange(website, checked as boolean)}
                />
                <label htmlFor={`website-${website}`} className="text-sm">
                  {website}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingResponse ? 'Updating...' : 'Creating...'}
              </>
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