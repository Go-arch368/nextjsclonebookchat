"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'react-toastify';

interface Template {
  id: number;
  userId: number;
  businessCategory: string;
  businessSubcategory: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface AddTemplateFormProps {
  onSave: () => void;
  onCancel: () => void;
  editingTemplate: Template | null;
}

const AddTemplateForm: React.FC<AddTemplateFormProps> = ({ onSave, onCancel, editingTemplate }) => {
  const [formData, setFormData] = useState({
    businessCategory: '',
    businessSubcategory: '',
  });

  // Initialize form with editing data
  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        businessCategory: editingTemplate.businessCategory,
        businessSubcategory: editingTemplate.businessSubcategory,
      });
    }
  }, [editingTemplate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.businessCategory.trim()) {
      return 'Business Category is required.';
    }
    if (!formData.businessSubcategory.trim()) {
      return 'Business Subcategory is required.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const payload: Template = {
      id: editingTemplate ? editingTemplate.id : Date.now(), // Temporary ID for new templates
      userId: 1,
      businessCategory: formData.businessCategory,
      businessSubcategory: formData.businessSubcategory,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingTemplate) {
        await axios.put(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/templates/update`, payload);
        toast.success('Template updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const response = await axios.post<Template>(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/templates/save`, payload);
        payload.id = response.data.id; // Use server-generated ID
        toast.success('Template created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      onSave();
      setFormData({
        businessCategory: '',
        businessSubcategory: '',
      });
    } catch (err) {
      toast.error('Failed to save template. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {editingTemplate ? 'Edit Template' : 'Add a new template'}
      </h1>
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