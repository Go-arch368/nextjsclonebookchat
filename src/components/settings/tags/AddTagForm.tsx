"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';
import { toast } from 'react-toastify';

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

const AddTagForm: React.FC<AddTagFormProps> = ({ onSave, onCancel, editingTag }) => {
  const [formData, setFormData] = useState({
    tag: '',
    isDefault: false,
    createdBy: '',
    company: '',
  });
  const [existingTags, setExistingTags] = useState<Set<string>>(new Set());

  // Fetch existing tags to validate against duplicates
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get<Tag[]>(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/tags`);
        setExistingTags(new Set(response.data.map((tag) => tag.tag.toLowerCase())));
      } catch (err) {
        toast.error('Failed to fetch existing tags for validation.', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error(err);
      }
    };

    fetchTags();
  }, []);

  // Initialize form with editing data
  useEffect(() => {
    if (editingTag) {
      setFormData({
        tag: editingTag.tag,
        isDefault: editingTag.isDefault,
        createdBy: editingTag.createdBy,
        company: editingTag.company,
      });
    }
  }, [editingTag]);

  const validateTag = (tag: string, currentId: number | null) => {
    if (tag.trim() === '') {
      return 'Tag cannot be empty.';
    }
    const tagLower = tag.trim().toLowerCase();
    if (existingTags.has(tagLower)) {
      // Allow the same tag if editing the same record
      if (editingTag && editingTag.tag.toLowerCase() === tagLower) {
        return null;
      }
      return `Tag "${tag}" already exists.`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateTag(formData.tag, editingTag ? editingTag.id : null);
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const payload: Tag = {
      id: editingTag ? editingTag.id : Date.now(), // Temporary ID for new tags
      userId: 1,
      tag: formData.tag,
      isDefault: formData.isDefault,
      createdBy: formData.createdBy,
      company: formData.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingTag) {
        // Update existing tag
        await axios.put(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/tags`, payload);
        toast.success('Tag updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        // Create new tag
        const response = await axios.post<Tag>(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/tags`, payload);
        payload.id = response.data.id; // Use server-generated ID
        toast.success('Tag created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      onSave();
      setFormData({
        tag: '',
        isDefault: false,
        createdBy: '',
        company: '',
      });
    } catch (err) {
      toast.error('Failed to save tag. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {editingTag ? 'Edit Tag' : 'Add a new tag'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="tag" className="text-sm font-medium text-gray-700">
            Tag
          </Label>
          <Input
            id="tag"
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tag (e.g., support)"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
          />
          <Label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
            Use as default
          </Label>
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

export default AddTagForm;