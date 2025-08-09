"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'react-toastify';

interface EyeCatcher {
  id: number;
  userId: number;
  title: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  imageUrl: string | null;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface AddEyeCatcherFormProps {
  onSave: (eyeCatcher: EyeCatcher | Omit<EyeCatcher, 'id' | 'imageUrl'>) => void;
  onCancel: () => void;
  initialData?: EyeCatcher;
  isEditMode?: boolean;
}

const AddEyeCatcherForm: React.FC<AddEyeCatcherFormProps> = ({
  onSave,
  onCancel,
  initialData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || 0,
    userId: initialData?.userId || 1,
    title: initialData?.title || '',
    text: initialData?.text || '',
    backgroundColor: initialData?.backgroundColor || '#ffffff',
    textColor: initialData?.textColor || '#000000',
    imageUrl: null as string | null,
    createdBy: initialData?.createdBy || 'Admin',
    company: initialData?.company || 'Example Corp',
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: initialData?.updatedAt || new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        id: initialData.id,
        userId: initialData.userId || 1,
        title: initialData.title || '',
        text: initialData.text || '',
        backgroundColor: initialData.backgroundColor || '#ffffff',
        textColor: initialData.textColor || '#000000',
        imageUrl: null,
        createdBy: initialData.createdBy || 'Admin',
        company: initialData.company || 'Example Corp',
        createdAt: initialData.createdAt || new Date().toISOString(),
        updatedAt: initialData.updatedAt || new Date().toISOString(),
      });
    }
  }, [initialData, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!formData.title.trim() || !formData.text.trim()) {
      setError('Title and Text are required fields');
      setIsSubmitting(false);
      return;
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(formData.backgroundColor) || !/^#[0-9A-Fa-f]{6}$/.test(formData.textColor)) {
      setError('Background and Text colors must be valid hex codes (e.g., #FF0000)');
      setIsSubmitting(false);
      return;
    }

    const eyeCatcherData = {
      ...(isEditMode && {
        id: formData.id,
        imageUrl: null,
      }),
      userId: formData.userId,
      title: formData.title.trim(),
      text: formData.text.trim(),
      backgroundColor: formData.backgroundColor,
      textColor: formData.textColor,
      createdBy: formData.createdBy || 'Admin',
      company: formData.company || 'Example Corp',
      createdAt: formData.createdAt,
      updatedAt: formData.updatedAt,
    };

    try {
      await onSave(eyeCatcherData);
      if (!isEditMode) {
        setFormData({
          id: 0,
          userId: 1,
          title: '',
          text: '',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          imageUrl: null,
          createdBy: 'Admin',
          company: 'Example Corp',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save eye catcher';
      console.error('Submit error:', errorMessage, err);
      setError(errorMessage);
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('for key \'title\'')) {
        const titleMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'title'/);
        const title = titleMatch ? titleMatch[1] : formData.title;
        toast.error(`Eye catcher with title '${title}' already exists`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(errorMessage, {
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
        {isEditMode ? 'Edit Eye Catcher' : 'Add a new eye catcher'}
      </h1>
      {error && (
        <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">{error}</div>
      )}
      <hr className="mb-10 font-bold" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-6">
          {/* Input Section */}
          <div className="flex-1 space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter eye catcher title"
              />
            </div>

            {/* Text */}
            <div>
              <Label htmlFor="text" className="text-sm font-medium text-gray-700">
                Text
              </Label>
              <Input
                id="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter eye catcher text"
              />
            </div>

            {/* Created By */}
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
              />
            </div>

            {/* Company */}
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
              />
            </div>

            {/* Background Color */}
            <div>
              <Label htmlFor="backgroundColor" className="text-sm font-medium text-gray-700">
                Background Color
              </Label>
              <Input
                id="backgroundColor"
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className="w-16 h-10 mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Text Color */}
            <div>
              <Label htmlFor="textColor" className="text-sm font-medium text-gray-700">
                Text Color
              </Label>
              <Input
                id="textColor"
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="w-16 h-10 mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex-1 space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Preview</Label>
              <div
                className="w-[300px] h-[200px] mt-2 border border-gray-300 shadow-lg rounded-md p-4 flex flex-col justify-center items-center"
                style={{ backgroundColor: formData.backgroundColor }}
              >
                <h2
                  className="text-lg font-semibold text-center"
                  style={{ color: formData.textColor }}
                >
                  {formData.title || 'Title Placeholder'}
                </h2>
                <p
                  className="text-sm text-center mt-2"
                  style={{ color: formData.textColor }}
                >
                  {formData.text || 'Text Placeholder'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save and Cancel Buttons */}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEyeCatcherForm;