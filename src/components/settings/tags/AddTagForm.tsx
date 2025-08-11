
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
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setError: (error: string | null) => void;
}

const AddTagForm: React.FC<AddTagFormProps> = ({ onSave, onCancel, editingTag, tags, setTags, setError }) => {
  const [formData, setFormData] = useState({
    tag: '',
    isDefault: false,
    createdBy: '',
    company: '',
  });
  const [errors, setErrors] = useState<{
    tag?: string;
    createdBy?: string;
    company?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = '/api/v1/settings/tags';

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

  const validateForm = () => {
    const newErrors: { tag?: string; createdBy?: string; company?: string } = {};
    if (!formData.tag.trim()) {
      newErrors.tag = 'Tag is required';
    } else {
      const tagLower = formData.tag.trim().toLowerCase();
      if (tags.some((t) => t.tag.toLowerCase() === tagLower && (!editingTag || t.id !== editingTag.id))) {
        newErrors.tag = `Tag "${formData.tag}" already exists`;
      }
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
    setErrors({});
    setError(null);

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

    const payload: Tag = {
      id: editingTag ? editingTag.id : 0,
      userId: 1,
      tag: formData.tag.trim(),
      isDefault: formData.isDefault,
      createdBy: formData.createdBy.trim(),
      company: formData.company.trim(),
      createdAt: editingTag ? editingTag.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await axios({
        method: editingTag ? 'PUT' : 'POST',
        url: API_BASE_URL,
        headers: { 'Content-Type': 'application/json' },
        data: payload,
      });

      setTags((prev) =>
        editingTag
          ? prev.map((t) => (t.id === response.data.id ? response.data : t))
          : [...prev, response.data]
      );
      toast.success(`Tag ${editingTag ? 'updated' : 'created'} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      onSave();
      setFormData({
        tag: '',
        isDefault: false,
        createdBy: '',
        company: '',
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Tags API route not found. Please check the server configuration.'
          : err.response?.status === 405
          ? 'Method not allowed. Please check the API configuration.'
          : err.response?.data?.message || err.message || `Failed to ${editingTag ? 'update' : 'create'} tag`;
      console.error('API error:', err);
      setError(message);
      if (message.includes('Duplicate entry') && message.includes('for key \'tag\'')) {
        const tagMatch = message.match(/Duplicate entry '([^']+)' for key 'tag'/);
        const tag = tagMatch ? tagMatch[1] : formData.tag;
        toast.error(`Tag "${tag}" already exists`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {editingTag ? 'Edit Tag' : 'Add a new tag'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="tag" className="text-sm font-medium text-gray-700">Tag *</Label>
          <Input
            id="tag"
            value={formData.tag}
            onChange={(e) => {
              setFormData({ ...formData, tag: e.target.value });
              setErrors((prev) => ({ ...prev, tag: '' }));
            }}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.tag ? 'border-red-500' : ''}`}
            placeholder="Enter tag (e.g., support)"
          />
          {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
            className="h-4 w-4 text-blue-500"
          />
          <Label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
            Use as default
          </Label>
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
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.createdBy ? 'border-red-500' : ''}`}
            placeholder="Enter creator name (e.g., admin)"
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
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-500' : ''}`}
            placeholder="Enter company name (e.g., Example Corp)"
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-8">
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
                {editingTag ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              editingTag ? 'Update' : 'Create'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTagForm;
