"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'sonner';

// TypeScript interface for the role permission
interface RolePermission {
  id: number;
  userId: number;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

interface AddRolePermissionFormProps {
  onSave: (rolePermission: RolePermission) => void;
  onCancel: () => void;
  rolePermission?: RolePermission | null;
}

const AddRolePermissionForm: React.FC<AddRolePermissionFormProps> = ({ onSave, onCancel, rolePermission }) => {
  const [formData, setFormData] = useState({
    userRole: rolePermission?.userRole || '',
  });
  const [errors, setErrors] = useState<{
    userRole?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.userRole.trim()) {
      newErrors.userRole = 'User role is required';
    }
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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
      id: rolePermission?.id || Date.now(),
      userId: rolePermission?.userId || 1,
      userRole: formData.userRole,
      createdAt: rolePermission?.createdAt || new Date().toISOString().slice(0, 19),
      updatedAt: new Date().toISOString().slice(0, 19),
    });
    setFormData({ userRole: '' });
    setErrors({});
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {rolePermission ? 'Edit Role Permission' : 'Add a new role permission'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="userRole" className="text-sm font-medium text-gray-700">
            User Role *
          </Label>
          <Input
            id="userRole"
            name="userRole"
            value={formData.userRole}
            onChange={handleInputChange}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.userRole ? 'border-red-500' : ''}`}
            placeholder="Enter user role (e.g., ADMIN)"
          />
          {errors.userRole && <p className="text-red-500 text-sm mt-1">{errors.userRole}</p>}
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
            {rolePermission ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddRolePermissionForm;