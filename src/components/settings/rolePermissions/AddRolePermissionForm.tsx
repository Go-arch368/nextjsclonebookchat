"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'sonner';

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
  rolePermission: RolePermission | null;
}

const AddRolePermissionForm: React.FC<AddRolePermissionFormProps> = ({ 
  onSave, 
  onCancel, 
  rolePermission 
}) => {
  const [formData, setFormData] = useState<Omit<RolePermission, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { 
    id?: number;
  }>({
    userRole: '',
  });

  const [errors, setErrors] = useState({
    userRole: '',
  });

  useEffect(() => {
    if (rolePermission) {
      setFormData({
        id: rolePermission.id,
        userRole: rolePermission.userRole,
      });
    } else {
      setFormData({
        userRole: '',
      });
    }
  }, [rolePermission]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      userRole: '',
    };

    if (!formData.userRole.trim()) {
      newErrors.userRole = 'User Role is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const now = new Date().toISOString();
    const payload: RolePermission = {
      id: formData.id || Date.now(),
      userId: 1, // Should be replaced with actual user ID from auth
      userRole: formData.userRole,
      createdAt: rolePermission?.createdAt || now,
      updatedAt: now,
    };

    onSave(payload);
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {rolePermission ? 'Edit Role Permission' : 'Add a new role permission'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="userRole" className="text-sm font-medium text-gray-700">
            User Role
          </Label>
          <Input
            id="userRole"
            value={formData.userRole}
            onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${
              errors.userRole ? 'border-red-500' : ''
            }`}
            placeholder="Enter user role (e.g., ADMIN, USER)"
            required
          />
          {errors.userRole && (
            <p className="text-red-500 text-sm mt-1">{errors.userRole}</p>
          )}
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