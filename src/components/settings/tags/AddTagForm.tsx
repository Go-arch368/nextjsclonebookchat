
"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Checkbox } from '@/ui/checkbox';

interface Tag {
  id: number;
  tag: string;
  isDefault: boolean;
}

interface AddTagFormProps {
  onSave: (tag: Tag) => void;
  onCancel: () => void;
}

const AddTagForm: React.FC<AddTagFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    tag: '',
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      tag: formData.tag,
      isDefault: formData.isDefault,
    });
    setFormData({
      tag: '',
      isDefault: false,
    });
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Add a new tag</h1>
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
            placeholder="tag"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
          />
          <Label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
            use as default
          </Label>
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
