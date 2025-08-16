"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

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
  ipAddress: IPAddress | null;
}

const AddIPAddressForm: React.FC<AddIPAddressFormProps> = ({ 
  onSave, 
  onCancel, 
  ipAddress 
}) => {
  const [formData, setFormData] = useState<Omit<IPAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { 
    id?: number;
  }>({
    ipAddress: '',
  });

  const [errors, setErrors] = useState({
    ipAddress: '',
  });

  const { theme } = useTheme();

  useEffect(() => {
    if (ipAddress) {
      setFormData({
        id: ipAddress.id,
        ipAddress: ipAddress.ipAddress,
      });
    } else {
      setFormData({
        ipAddress: '',
      });
    }
  }, [ipAddress]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      ipAddress: '',
    };

    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = 'IP Address is required';
      valid = false;
    } else if (!ipRegex.test(formData.ipAddress)) {
      newErrors.ipAddress = 'Please enter a valid IP address (e.g., 192.168.1.1)';
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
    const payload: IPAddress = {
      id: formData.id || Date.now(),
      userId: 1,
      ipAddress: formData.ipAddress,
      createdAt: ipAddress?.createdAt || now,
      updatedAt: now,
    };

    onSave(payload);
  };

  return (
    <div className={`p-10 rounded-xl shadow-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h1 className={`text-4xl font-bold mb-10 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {ipAddress ? 'Edit IP Address' : 'Add a new IP address'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="ipAddress" className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            IP Address
          </Label>
          <Input
            id="ipAddress"
            value={formData.ipAddress}
            onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
            className={`w-full mt-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'} ${
              errors.ipAddress ? 'border-red-500' : ''
            }`}
            placeholder="Enter IP address (e.g., 192.168.1.1)"
            required
          />
          {errors.ipAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.ipAddress}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            className={`px-6 py-2 ${theme === 'dark' ? 'border-gray-700 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-800'}`}
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