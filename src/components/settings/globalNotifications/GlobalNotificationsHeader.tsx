"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/ui/button';
import { Switch } from '@/ui/switch';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Trash2 } from 'lucide-react'
import { toast } from 'react-toastify';

// TypeScript interface for the notification setting
interface Notification {
  id: number;
  userId: number;
  useSameEmail: boolean;
  notificationsEmail: string;
  notifyLead: boolean;
  notifyServiceChat: boolean;
  createdAt: string;
  updatedAt: string;
}

const GlobalNotificationsHeader: React.FC = () => {
  const [formData, setFormData] = useState<Notification>({
    id: 1,
    userId: 1,
    useSameEmail: true,
    notificationsEmail: '',
    notifyLead: false,
    notifyServiceChat: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [hasSetting, setHasSetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notification setting on mount
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Notification[]>('https://zotly.onrender.com/api/v1/settings/global-notifications/all');
        if (response.data.length > 0) {
          setFormData(response.data[0]); // Use the first (latest) setting
          setHasSetting(true);
        } else {
          setHasSetting(false);
        }
      } catch (err) {
        toast.error('Failed to fetch notification setting. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotification();
  }, []);

  const validateForm = () => {
    if (formData.useSameEmail && !formData.notificationsEmail) {
      return 'Notifications email is required when using the same email.';
    }
    if (formData.useSameEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.notificationsEmail)) {
      return 'A valid email address is required.';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const payload: Notification = {
      ...formData,
      userId: 1,
      notificationsEmail: formData.useSameEmail ? formData.notificationsEmail : '',
      createdAt: hasSetting ? formData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (hasSetting) {
        await axios.put('https://zotly.onrender.com/api/v1/settings/global-notifications/update', payload);
        toast.success('Notification setting updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        const response = await axios.post<Notification>('https://zotly.onrender.com/api/v1/settings/global-notifications/save', {
          ...payload,
          id: undefined, // Let backend generate ID
        });
        setFormData(response.data); // Update with server data
        setHasSetting(true);
        toast.success('Notification setting created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      // Refresh the form with the latest data
      const response = await axios.get<Notification[]>('https://zotly.onrender.com/api/v1/settings/global-notifications/all');
      if (response.data.length > 0) {
        setFormData(response.data[0]);
        setHasSetting(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save notification setting. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the notification setting?')) return;

    try {
      await axios.delete('https://zotly.onrender.com/api/v1/settings/global-notifications/delete/1');
      setFormData({
        id: 1,
        userId: 1,
        useSameEmail: true,
        notificationsEmail: '',
        notifyLead: false,
        notifyServiceChat: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setHasSetting(false);
      toast.success('Notification setting deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete notification setting. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Global notification settings</h1>
        {hasSetting ? (
          <div className="flex items-center gap-3">
            <Button
              className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete</span>
            </Button>
            <Button
              className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
              onClick={handleSave}
              disabled={isLoading}
            >
              Save
            </Button>
          </div>
        ) : (
          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
            onClick={handleSave}
            disabled={isLoading}
          >
            Create
          </Button>
        )}
      </div>
      <hr className="mt-10" />
      {isLoading ? (
        <div className="mt-4 space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-2">
            <Switch
              checked={formData.useSameEmail}
              onCheckedChange={(checked) => setFormData({ ...formData, useSameEmail: checked })}
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
            />
            <span className="text-sm text-gray-900">
              Use the same email for leads and service chat
            </span>
          </div>
          {formData.useSameEmail && (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="notificationsEmail" className="text-sm font-medium text-gray-700">
                  Notifications email
                </Label>
                <Input
                  id="notificationsEmail"
                  type="email"
                  value={formData.notificationsEmail}
                  onChange={(e) => setFormData({ ...formData, notificationsEmail: e.target.value })}
                  placeholder="Enter email address"
                  className="mt-2 w-full p-3 text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 mt-10">
                <Switch
                  checked={formData.notifyLead}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifyLead: checked })}
                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
                />
                <span className="text-sm text-gray-900">Notify me when a lead is generated</span>
              </div>
              <div className="flex items-center gap-2 mt-10">
                <Switch
                  checked={formData.notifyServiceChat}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifyServiceChat: checked })}
                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200"
                />
                <span className="text-sm text-gray-900">Notify me when a service chat is generated</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GlobalNotificationsHeader;