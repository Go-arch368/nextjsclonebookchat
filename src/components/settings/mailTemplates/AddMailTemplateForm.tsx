"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { toast } from 'sonner';

// TypeScript interface for the mail template
interface MailTemplate {
  id: number;
  userId: number;
  name: string;
  useCase: string;
  subject: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface AddMailTemplateFormProps {
  onSave: (template: MailTemplate) => void;
  onCancel: () => void;
  template?: MailTemplate | null;
}

const AddMailTemplateForm: React.FC<AddMailTemplateFormProps> = ({ onSave, onCancel, template }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    useCase: template?.useCase || '',
    active: template?.active !== undefined ? template.active : true,
    createdBy: template?.createdBy || '',
    modifiedBy: template?.modifiedBy || '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    useCase?: string;
    createdBy?: string;
    modifiedBy?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.useCase.trim()) {
      newErrors.useCase = 'Use case is required';
    }
    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Created by is required';
    }
    if (!formData.modifiedBy.trim()) {
      newErrors.modifiedBy = 'Modified by is required';
    }
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill all required fields');
      return;
    }

    onSave({
      id: template?.id || Date.now(),
      userId: template?.userId || 1,
      name: formData.name,
      useCase: formData.useCase,
      subject: template?.subject || 'Default Subject',
      active: formData.active,
      createdBy: formData.createdBy,
      createdAt: template?.createdAt || new Date().toISOString().slice(0, 19),
      modifiedBy: formData.modifiedBy,
      modifiedAt: new Date().toISOString().slice(0, 19),
    });
    setFormData({
      name: '',
      useCase: '',
      active: true,
      createdBy: '',
      modifiedBy: '',
    });
    setErrors({});
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {template ? 'Edit Mail Template' : 'Add a new mail template'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter template name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="useCase" className="text-sm font-medium text-gray-700">
            Use Case *
          </Label>
          <Input
            id="useCase"
            name="useCase"
            value={formData.useCase}
            onChange={handleInputChange}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.useCase ? 'border-red-500' : ''}`}
            placeholder="Enter use case"
          />
          {errors.useCase && <p className="text-red-500 text-sm mt-1">{errors.useCase}</p>}
        </div>
        <div>
          <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">
            Created By *
          </Label>
          <Input
            id="createdBy"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleInputChange}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.createdBy ? 'border-red-500' : ''}`}
            placeholder="Enter creator name"
          />
          {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
        </div>
        <div>
          <Label htmlFor="modifiedBy" className="text-sm font-medium text-gray-700">
            Modified By *
          </Label>
          <Input
            id="modifiedBy"
            name="modifiedBy"
            value={formData.modifiedBy}
            onChange={handleInputChange}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.modifiedBy ? 'border-red-500' : ''}`}
            placeholder="Enter modifier name"
          />
          {errors.modifiedBy && <p className="text-red-500 text-sm mt-1">{errors.modifiedBy}</p>}
        </div>
        <div>
          <Label htmlFor="active" className="text-sm font-medium text-gray-700">
            Active
          </Label>
          <Checkbox
            id="active"
            checked={formData.active}
            onCheckedChange={handleActiveChange}
            className="mt-2"
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
            {template ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddMailTemplateForm;