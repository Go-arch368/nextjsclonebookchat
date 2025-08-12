"use client";

import React, { useState, useEffect } from 'react';
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
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface AddTemplateFormProps {
  onSave: () => void;
  onCancel: () => void;
  editingTemplate: Template | null;
}

const AddTemplateForm: React.FC<AddTemplateFormProps> = ({ 
  onSave, 
  onCancel, 
  editingTemplate 
}) => {
  const [formData, setFormData] = useState<Omit<Template, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { 
    id?: number;
  }>({
    businessCategory: '',
    businessSubcategory: '',
    createdBy: 'Admin',
    company: 'Zotly',
  });

  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        id: editingTemplate.id,
        businessCategory: editingTemplate.businessCategory,
        businessSubcategory: editingTemplate.businessSubcategory,
        createdBy: editingTemplate.createdBy,
        company: editingTemplate.company,
      });
    } else {
      setFormData({
        businessCategory: '',
        businessSubcategory: '',
        createdBy: 'Admin',
        company: 'Zotly',
      });
    }
  }, [editingTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessCategory.trim()) {
      toast.error('Business Category is required');
      return;
    }

    if (!formData.businessSubcategory.trim()) {
      toast.error('Business Subcategory is required');
      return;
    }

    try {
      const now = new Date().toISOString();
      const payload = {
        ...formData,
        userId: 1, // Default user ID
        createdAt: now,
        updatedAt: now,
      };

      const url = '/api/v1/settings/templates';
      const method = editingTemplate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(editingTemplate 
          ? 'Failed to update template' 
          : 'Failed to create template');
      }

      toast.success(editingTemplate 
        ? 'Template updated successfully' 
        : 'Template created successfully');
      
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
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
            value={formData.businessCategory}
            onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
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
            value={formData.businessSubcategory}
            onChange={(e) => setFormData({ ...formData, businessSubcategory: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter business subcategory"
            required
          />
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
            placeholder="Enter creator name"
            required
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
            placeholder="Enter company name"
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