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
  theme?: string;
}

const AddSmartResponseForm: React.FC<AddSmartResponseFormProps> = ({
  onSave,
  onCancel,
  editingResponse,
  smartResponses,
  theme = 'light',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const shortcuts = formData.shortcuts.split(',').map(s => s.trim()).filter(s => s);
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

      onSave(payload);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save smart response', {
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    } finally {
      setIsSubmitting(false);
    }
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
        {editingResponse ? 'Edit Smart Response' : 'Add New Smart Response'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shortcuts Field */}
        <div>
          <Label htmlFor="shortcuts" className={`pt-4 pb-2${theme === 'dark' ? 'text-gray-300' : ''}`}>
            Shortcuts *
          </Label>
          <Input
            id="shortcuts"
            value={formData.shortcuts}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, shortcuts: e.target.value }));
              setErrors(prev => ({ ...prev, shortcuts: '' }));
            }}
            placeholder="Comma separated shortcuts (e.g., thanks, inquiry)"
            className={`${errors.shortcuts ? 'border-red-500' : ''} ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : ''
            }`}
          />
          {errors.shortcuts && (
            <p className="text-red-500 text-sm mt-1">{errors.shortcuts}</p>
          )}
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Use #shortcut during chat to trigger this response
          </p>
        </div>

        {/* Response Field */}
        <div>
          <Label htmlFor="response" className={theme === 'dark' ? 'text-gray-300' : ''}>
            Response *
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {variables.map(variable => (
              <Button
                key={variable}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleVariableClick(variable)}
                className={theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
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
            className={`min-h-[150px] ${errors.response ? 'border-red-500' : ''} ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : ''
            }`}
            placeholder="Enter your response message..."
          />
          {errors.response && (
            <p className="text-red-500 text-sm mt-1">{errors.response}</p>
          )}
        </div>

        {/* Created By Field */}
        <div>
          <Label htmlFor="createdBy" className={theme === 'dark' ? 'text-gray-300' : ''}>
            Created By *
          </Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, createdBy: e.target.value }));
              setErrors(prev => ({ ...prev, createdBy: '' }));
            }}
            className={`${errors.createdBy ? 'border-red-500' : ''} ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : ''
            }`}
          />
          {errors.createdBy && (
            <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>
          )}
        </div>

        {/* Company Field */}
        <div>
          <Label htmlFor="company" className={theme === 'dark' ? 'text-gray-300' : ''}>
            Company *
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, company: e.target.value }));
              setErrors(prev => ({ ...prev, company: '' }));
            }}
            className={`${errors.company ? 'border-red-500' : ''} ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : ''
            }`}
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>

        {/* Websites Field */}
        <div>
          <Label className={theme === 'dark' ? 'text-gray-300' : ''}>
            Websites
          </Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {websiteOptions.map(website => (
              <div key={website} className="flex items-center space-x-2">
                <Checkbox
                  id={`website-${website}`}
                  checked={formData.websites.includes(website)}
                  onCheckedChange={(checked) => handleWebsiteChange(website, checked as boolean)}
                />
                <label 
                  htmlFor={`website-${website}`} 
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : ''
                  }`}
                >
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
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark'
      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
      : 'border-gray-300 text-gray-800 hover:bg-gray-100'
  }`}
>
  Cancel
</Button>

{/* Submit Button with Loading State */}
<Button 
  type="submit"
  disabled={isSubmitting}
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-blue-600 hover:bg-blue-700'
  } text-white`}
>
  {isSubmitting ? (
    <>
      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
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