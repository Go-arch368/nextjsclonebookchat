
"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';

interface MailTemplate {
  id: number;
  name: string;
  useCase: string;
  subject: string;
  active: boolean;
}

interface AddMailTemplateFormProps {
  onSave: (template: MailTemplate) => void;
  onCancel: () => void;
}

const AddMailTemplateForm: React.FC<AddMailTemplateFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    useCase: '',
    subject: '',
  });
  const [variableSearch, setVariableSearch] = useState('');
  const subjectInputRef = useRef<HTMLInputElement>(null);

  const variables = [
    '{FirstName}',
    '{LastName}',
    '{Company}',
    '{Email}',
    '{Date}',
  ];

  const filteredVariables = variables.filter((variable) =>
    variable.toLowerCase().includes(variableSearch.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariableClick = (variable: string) => {
    if (subjectInputRef.current) {
      const input = subjectInputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = formData.subject.slice(0, start) + variable + formData.subject.slice(end);
      setFormData((prev) => ({ ...prev, subject: newValue }));
      // Move cursor after inserted variable
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + variable.length;
        input.focus();
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      name: formData.name,
      useCase: formData.useCase,
      subject: formData.subject,
      active: true,
    });
    setFormData({
      name: '',
      useCase: '',
      subject: '',
    });
    setVariableSearch('');
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new mail template</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter template name"
          />
        </div>
        <div>
          <Label htmlFor="useCase" className="text-sm font-medium text-gray-700">
            Use case
          </Label>
          <Input
            id="useCase"
            name="useCase"
            value={formData.useCase}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter use case"
          />
        </div>
        <div>
          <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email subject"
            ref={subjectInputRef}
          />
        </div>
        <div>
          <Label htmlFor="variableSearch" className="text-sm font-medium text-gray-700">
            Mail Variables
          </Label>
          <Input
            id="variableSearch"
            value={variableSearch}
            onChange={(e) => setVariableSearch(e.target.value)}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Search variables"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {filteredVariables.length > 0 ? (
              filteredVariables.map((variable) => (
                <Button
                  key={variable}
                  type="button"
                  variant="outline"
                  className="px-3 py-1 text-sm border-gray-300 text-gray-700 hover:bg-blue-50"
                  onClick={() => handleVariableClick(variable)}
                >
                  {variable}
                </Button>
              ))
            ) : (
              <span className="text-sm text-gray-500">No variables found</span>
            )}
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

export default AddMailTemplateForm;
