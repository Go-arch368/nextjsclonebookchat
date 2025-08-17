'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
  const { theme } = useTheme();
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
      userId: 1,
      userRole: formData.userRole,
      createdAt: rolePermission?.createdAt || now,
      updatedAt: now,
    };

    onSave(payload);
  };

  return (
    <div className={`p-10 rounded-xl shadow-lg border ${
      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h1 className={`text-2xl font-semibold text-gray-800 dark:text-white mb-10 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        {rolePermission ? 'Edit Role Permission' : 'Add a new role permission'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="userRole" className={theme === 'dark' ? 'text-gray-300' : ''}>
            User Role
          </Label>
          <Input
            id="userRole"
            value={formData.userRole}
            onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
            className={`w-full mt-2 focus:ring-2 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
                : 'border-gray-300 focus:ring-blue-500'
            } ${errors.userRole ? 'border-red-500' : ''}`}
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
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark' 
      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
      : 'border-gray-300 text-gray-800 hover:bg-gray-100'
  }`}
  onClick={onCancel}
>
  Cancel
</Button>

{/* Primary Submit Button */}
<Button 
  type="submit"
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-blue-600 hover:bg-blue-700'
  } text-white`}
>
  {rolePermission ? 'Update' : 'Save'}
</Button>
        </div>
      </form>
    </div>
  );
};

export default AddRolePermissionForm;