
"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';

interface Template {
  id: number;
  businessCategory: string;
  businessSubcategory: string;
  createdBy: string;
  dateTime: string;
}

interface AddTemplateFormProps {
  onSave: (template: Template) => void;
  onCancel: () => void;
}

const AddTemplateForm: React.FC<AddTemplateFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    businessCategory: '',
    businessSubcategory: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessCategory || !formData.businessSubcategory) {
      alert('Business Category and Business Subcategory are required.');
      return;
    }
    onSave({
      id: Date.now(),
      businessCategory: formData.businessCategory,
      businessSubcategory: formData.businessSubcategory,
      createdBy: 'Current User',
      dateTime: new Date().toISOString(),
    });
    setFormData({
      businessCategory: '',
      businessSubcategory: '',
    });
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new template</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="businessCategory" className="text-sm font-medium text-gray-700">
            Business Category
          </Label>
          <Input
            id="businessCategory"
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter business category"
            required
          />
        </div>
        <div>
          <Label htmlFor="businessSubcategory" className="text-sm font-medium text-gray-700">
            Business Subcategory
          </Label>
          <Input
            id="businessSubcategory"
            name="businessSubcategory"
            value={formData.businessSubcategory}
            onChange={handleInputChange}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter business subcategory"
            required
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

export default AddTemplateForm;
