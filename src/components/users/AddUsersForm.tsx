"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { toast } from 'sonner';
import { User } from '@/types/user';

interface AddUsersFormProps {
  onSubmit: (data: User) => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ROLES = ["ADMIN", "MANAGER", "SUPERVISOR", "AGENT"];

const AddUsersForm: React.FC<AddUsersFormProps> = ({ onSubmit, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState<User>({
    id: 0,
    email: '',
    role: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    department: '',
    companyId: 0,
    simultaneousChatLimit: 0,
    createdAt: '',
    updatedAt: '',
    deletedAt: null,
    passwordHash: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    companyId?: string;
    simultaneousChatLimit?: string;
    passwordHash?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'A valid email address is required';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.companyId) {
      newErrors.companyId = 'Company ID is required';
    }
    if (!formData.simultaneousChatLimit) {
      newErrors.simultaneousChatLimit = 'Chat limit is required';
    }
    if (!formData.passwordHash) {
      newErrors.passwordHash = 'Password is required';
    }
    if (formData.passwordHash !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        id: 0,
        email: '',
        role: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        department: '',
        companyId: 0,
        simultaneousChatLimit: 0,
        createdAt: '',
        updatedAt: '',
        deletedAt: null,
        passwordHash: '',
      });
      setConfirmPassword('');
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to add user');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'companyId' || name === 'simultaneousChatLimit' ? (value ? parseInt(value) : 0) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'passwordHash') {
      setConfirmPassword('');
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    setErrors((prev) => ({ ...prev, role: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              className={`w-full mt-1 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role *
            </Label>
            <Select value={formData.role} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
          <div>
            <Label htmlFor="passwordHash" className="text-sm font-medium text-gray-700">
              Password *
            </Label>
            <Input
              id="passwordHash"
              name="passwordHash"
              type="password"
              value={formData.passwordHash}
              onChange={handleInputChange}
              placeholder="Enter password"
              className={`w-full mt-1 ${errors.passwordHash ? 'border-red-500' : ''}`}
            />
            {errors.passwordHash && <p className="text-red-500 text-sm mt-1">{errors.passwordHash}</p>}
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password *
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Confirm password"
              className={`w-full mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              className={`w-full mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name *
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              className={`w-full mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
          <div>
            <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Enter job title"
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label htmlFor="department" className="text-sm font-medium text-gray-700">
              Department
            </Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter department"
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label htmlFor="companyId" className="text-sm font-medium text-gray-700">
              Company ID *
            </Label>
            <Input
              id="companyId"
              name="companyId"
              type="number"
              value={formData.companyId || ''}
              onChange={handleInputChange}
              placeholder="Enter company ID"
              className={`w-full mt-1 ${errors.companyId ? 'border-red-500' : ''}`}
            />
            {errors.companyId && <p className="text-red-500 text-sm mt-1">{errors.companyId}</p>}
          </div>
          <div>
            <Label htmlFor="simultaneousChatLimit" className="text-sm font-medium text-gray-700">
              Simultaneous Chat Limit *
            </Label>
            <Input
              id="simultaneousChatLimit"
              name="simultaneousChatLimit"
              type="number"
              value={formData.simultaneousChatLimit || ''}
              onChange={handleInputChange}
              placeholder="Enter chat limit"
              className={`w-full mt-1 ${errors.simultaneousChatLimit ? 'border-red-500' : ''}`}
            />
            {errors.simultaneousChatLimit && <p className="text-red-500 text-sm mt-1">{errors.simultaneousChatLimit}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsersForm;