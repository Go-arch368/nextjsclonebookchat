"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'sonner';

// TypeScript interface for the IP address
interface IPAddress {
  id: number;
  userId: number;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface AddIPAddressFormProps {
  onSave: (ipAddress: IPAddress) => void;
  onCancel: () => void;
  ipAddress?: IPAddress | null;
}

const AddIPAddressForm: React.FC<AddIPAddressFormProps> = ({ onSave, onCancel, ipAddress }) => {
  const [formData, setFormData] = useState({
    ipAddress: ipAddress?.ipAddress || '',
  });
  const [errors, setErrors] = useState<{
    ipAddress?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = 'IP address is required';
    } else if (!ipRegex.test(formData.ipAddress)) {
      newErrors.ipAddress = 'Please enter a valid IP address (e.g., 192.168.1.1)';
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
      toast.error('Please fill all required fields correctly');
      return;
    }

    onSave({
      id: ipAddress?.id || Date.now(),
      userId: ipAddress?.userId || 1,
      ipAddress: formData.ipAddress,
      createdAt: ipAddress?.createdAt || new Date().toISOString().slice(0, 19),
      updatedAt: new Date().toISOString().slice(0, 19),
    });
    setFormData({ ipAddress: '' });
    setErrors({});
    onCancel();
  };

  return (
    <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {ipAddress ? 'Edit IP Address' : 'Add a new IP address'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="ipAddress" className="text-sm font-medium text-gray-700">
            IP Address *
          </Label>
          <Input
            id="ipAddress"
            name="ipAddress"
            value={formData.ipAddress}
            onChange={handleInputChange}
            className={`w-full mt-2 border-gray-300 focus:ring-2 focus:ring-blue-500 ${errors.ipAddress ? 'border-red-500' : ''}`}
            placeholder="Enter IP address (e.g., 192.168.1.1)"
          />
          {errors.ipAddress && <p className="text-red-500 text-sm mt-1">{errors.ipAddress}</p>}
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
            {ipAddress ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddIPAddressForm;