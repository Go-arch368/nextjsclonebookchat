"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Switch } from '@/ui/switch';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';
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
    id: 0,
    userId: 1,
    useSameEmail: true,
    notificationsEmail: '',
    notifyLead: false,
    notifyServiceChat: false,
    createdAt: '',
    updatedAt: '',
  });
  const [hasSetting, setHasSetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

   const { theme } = useTheme();

  // Fetch notification setting
  const fetchNotification = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/settings/global-notifications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification settings');
      }

      const data = await response.json();
      if (data.length > 0) {
        setFormData(data[0]);
        setHasSetting(true);
      } else {
        setHasSetting(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const validateForm = () => {
    if (formData.useSameEmail && !formData.notificationsEmail) {
      return 'Notifications email is required when using the same email';
    }
    if (formData.useSameEmail && !/^\S+@\S+\.\S+$/.test(formData.notificationsEmail)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

const handleSave = async () => {
  const validationError = validateForm();
  if (validationError) {
    toast.error(validationError);
    return;
  }

  try {
    const currentTimestamp = new Date().toISOString();
    const payload = {
      ...formData,
      notificationsEmail: formData.useSameEmail ? formData.notificationsEmail : '',
      createdAt: hasSetting ? formData.createdAt : currentTimestamp,
      updatedAt: currentTimestamp
    };

    const method = hasSetting ? 'PUT' : 'POST';
    const url = '/api/v1/settings/global-notifications';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save settings');
    }

    await fetchNotification();
    toast.success(
      hasSetting 
        ? 'Notification settings updated successfully' 
        : 'Notification settings created successfully'
    );
  } catch (error: any) {
    toast.error(error.message || 'Failed to save settings');
  }
};

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete these notification settings?')) return;

    try {
      const response = await fetch(`/api/v1/settings/global-notifications?id=${formData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete settings');
      }

      setFormData({
        id: 0,
        userId: 1,
        useSameEmail: true,
        notificationsEmail: '',
        notifyLead: false,
        notifyServiceChat: false,
        createdAt: '',
        updatedAt: '',
      });
      setHasSetting(false);
      toast.success('Notification settings deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete settings');
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Global Notification Settings</h1>
        <div className="flex gap-3">
          {hasSetting && (
            <Button
  variant="destructive"
  onClick={handleDelete}
  disabled={isLoading}
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md"
>
  <Trash2 className="w-4 h-4" />
  Delete
</Button>
          )}
         <Button
  onClick={handleSave}
  disabled={isLoading}
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-blue-600 hover:bg-blue-700'
  } text-white`}
>
  {hasSetting ? 'Save Changes' : 'Create Settings'}
</Button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Switch
                id="useSameEmail"
                checked={formData.useSameEmail}
                onCheckedChange={(checked) => setFormData({ ...formData, useSameEmail: checked })}
              />
              <Label htmlFor="useSameEmail">
                Use the same email for all notifications
              </Label>
            </div>

            {formData.useSameEmail && (
              <div className="space-y-2">
                <Label htmlFor="notificationsEmail">Notification Email</Label>
                <Input
                  id="notificationsEmail"
                  type="email"
                  value={formData.notificationsEmail}
                  onChange={(e) => setFormData({ ...formData, notificationsEmail: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            )}

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="notifyLead"
                  checked={formData.notifyLead}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifyLead: checked })}
                />
                <Label htmlFor="notifyLead">
                  Notify me when a new lead is created
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="notifyServiceChat"
                  checked={formData.notifyServiceChat}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifyServiceChat: checked })}
                />
                <Label htmlFor="notifyServiceChat">
                  Notify me when a new service chat starts
                </Label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GlobalNotificationsHeader;