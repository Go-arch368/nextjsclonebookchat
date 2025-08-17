"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';

interface Tag {
  id: number;
  userId: number;
  tag: string;
  isDefault: boolean;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface AddTagFormProps {
  onSave: () => void;
  onCancel: () => void;
  editingTag: Tag | null;
}

const AddTagForm: React.FC<AddTagFormProps> = ({ 
  onSave, 
  onCancel, 
  editingTag 
}) => {
  const [formData, setFormData] = useState({
    tag: '',
    isDefault: false,
    createdBy: '',
    company: '',
  });
  const { theme } = useTheme();

  useEffect(() => {
    if (editingTag) {
      setFormData({
        tag: editingTag.tag,
        isDefault: editingTag.isDefault,
        createdBy: editingTag.createdBy,
        company: editingTag.company,
      });
    } else {
      setFormData({
        tag: '',
        isDefault: false,
        createdBy: '',
        company: '',
      });
    }
  }, [editingTag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tag.trim()) {
      toast.error('Tag name is required');
      return;
    }

    const payload: Tag = {
      id: editingTag?.id || Date.now(),
      userId: 1,
      tag: formData.tag,
      isDefault: formData.isDefault,
      createdBy: formData.createdBy,
      company: formData.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const method = editingTag ? 'PUT' : 'POST';
      const url = editingTag 
        ? `/api/v1/settings/tags?id=${editingTag.id}`
        : '/api/v1/settings/tags';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save tag');

      toast.success(`Tag ${editingTag ? 'updated' : 'created'} successfully`);
      onSave();
    } catch (error) {
      toast.error('Failed to save tag');
      console.error(error);
    }
  };

  return (
    <div className={`p-10 rounded-xl shadow-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h1 className={`text-2xl font-semibold text-gray-800 dark:text-white ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {editingTag ? 'Edit Tag' : 'Add a new tag'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="tag" className={`text-sm font-medium  pb-1 pt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Tag Name
          </Label>
          <Input
            id="tag"
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-black'}`}
            placeholder="Enter tag name"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) => setFormData({ ...formData, isDefault: !!checked })}
          />
          <Label htmlFor="isDefault" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Set as default tag
          </Label>
        </div>

        <div>
          <Label htmlFor="createdBy" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Created By
          </Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-black'}`}
            placeholder="Enter creator name"
            required
          />
        </div>

        <div>
          <Label htmlFor="company" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Company
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-black'}`}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
      <Button
  type="button"
  variant="outline"
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark' 
      ? 'border-gray-600 text-white hover:bg-gray-800' 
      : 'border-gray-300 text-gray-800 hover:bg-gray-100'
  }`}
  onClick={onCancel}
>
  Cancel
</Button>

{/* Save/Update Button */}
<Button
  type="submit"
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md bg-blue-600 hover:bg-blue-800 text-white`}
>
  {editingTag ? 'Update' : 'Save'}
</Button>
        </div>
      </form>
    </div>
  );
};

export default AddTagForm;