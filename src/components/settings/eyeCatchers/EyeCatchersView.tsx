"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddEyeCatcherForm from './AddEyeCatcherForm';
import EyeCatcherHeader from './EyeCatherHeader';
import { useTheme } from 'next-themes';

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

const EyeCatchersView: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEyeCatcher, setEditingEyeCatcher] = useState<EyeCatcher | null>(null);
  const [eyeCatchers, setEyeCatchers] = useState<EyeCatcher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = '/api/settings/eye-catchers';

  useEffect(() => {
    fetchEyeCatchers();
  }, []);

  const fetchEyeCatchers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<EyeCatcher[]>(`${API_BASE_URL}?action=list`);
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      setEyeCatchers(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Eye catchers API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to load eye catchers';
      console.error('Fetch error:', errorMessage, err.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
      setEyeCatchers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setEditingEyeCatcher(null);
    setError(null);
  };

  const handleEditClick = (eyeCatcher: EyeCatcher) => {
    setEditingEyeCatcher(eyeCatcher);
    setShowEditForm(true);
    setShowAddForm(false);
    setError(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingEyeCatcher(null);
    setError(null);
  };

  const handleSave = async (eyeCatcher: Omit<EyeCatcher, 'id' | 'imageUrl'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const payload = {
        userId: eyeCatcher.userId || 1,
        title: eyeCatcher.title.trim(),
        text: eyeCatcher.text.trim(),
        backgroundColor: eyeCatcher.backgroundColor || '#ffffff',
        textColor: eyeCatcher.textColor || '#000000',
        createdBy: eyeCatcher.createdBy || 'Admin',
        company: eyeCatcher.company || 'Example Corp',
        createdAt: eyeCatcher.createdAt || new Date().toISOString(),
        updatedAt: eyeCatcher.updatedAt || new Date().toISOString(),
      };
      const response = await axios.post(`${API_BASE_URL}`, payload);
      const savedEyeCatcher: EyeCatcher = response.data;
      setEyeCatchers((prev) => [...prev, savedEyeCatcher]);
      setShowAddForm(false);
      toast.success(
        response.data?.message ||
        (typeof response.data === 'object' && 'title' in response.data
          ? `Eye catcher ${response.data.title} saved successfully!`
          : 'Eye catcher saved successfully!'),
        {
          position: 'top-right',
          autoClose: 3000,
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Eye catchers API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to add eye catcher';
      console.error('Save error:', errorMessage, err.response?.data);
      setError(errorMessage);
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('for key \'title\'')) {
        const titleMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'title'/);
        const title = titleMatch ? titleMatch[1] : eyeCatcher.title;
        toast.error(`Eye catcher with title '${title}' already exists`, {
          position: 'top-right',
          autoClose: 3000,
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        });
      } else {
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (eyeCatcher: EyeCatcher) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.put(`${API_BASE_URL}`, {
        id: eyeCatcher.id,
        userId: eyeCatcher.userId || 1,
        title: eyeCatcher.title.trim(),
        text: eyeCatcher.text.trim(),
        backgroundColor: eyeCatcher.backgroundColor,
        textColor: eyeCatcher.textColor,
        imageUrl: null,
        createdBy: eyeCatcher.createdBy || 'Admin',
        company: eyeCatcher.company || 'Example Corp',
        createdAt: eyeCatcher.createdAt,
        updatedAt: new Date().toISOString(),
      });
      const updatedEyeCatcher: EyeCatcher = response.data;
      setEyeCatchers((prev) =>
        prev.map((item) => (item.id === updatedEyeCatcher.id ? updatedEyeCatcher : item))
      );
      setShowEditForm(false);
      setEditingEyeCatcher(null);
      toast.success(
        response.data?.message ||
        (typeof response.data === 'object' && 'title' in response.data
          ? `Eye catcher ${response.data.title} updated successfully!`
          : 'Eye catcher updated successfully!'),
        {
          position: 'top-right',
          autoClose: 3000,
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Eye catchers API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to update eye catcher';
      console.error('Update error:', errorMessage, err.response?.data);
      setError(errorMessage);
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('for key \'title\'')) {
        const titleMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'title'/);
        const title = titleMatch ? titleMatch[1] : eyeCatcher.title;
        toast.error(`Eye catcher with title '${title}' already exists`, {
          position: 'top-right',
          autoClose: 3000,
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        });
      } else {
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className={`p-4 mb-4 rounded-lg ${
            resolvedTheme === 'dark'
              ? 'bg-red-900 text-red-200'
              : 'bg-red-100 text-red-800'
          }`}>
            {error}
          </div>
        )}
        {showAddForm ? (
          <AddEyeCatcherForm
            onSave={handleSave}
            onCancel={handleCancel}
            isEditMode={false}
            theme={resolvedTheme}
          />
        ) : showEditForm && editingEyeCatcher ? (
          <AddEyeCatcherForm
            onSave={handleUpdate as (eyeCatcher: EyeCatcher | Omit<EyeCatcher, 'id' | 'imageUrl'>) => void}
            onCancel={handleCancel}
            initialData={editingEyeCatcher}
            isEditMode={true}
            theme={resolvedTheme}
          />
        ) : (
          <EyeCatcherHeader
            onAddClick={handleAddClick}
            onEditClick={handleEditClick}
            eyeCatchers={eyeCatchers}
            onRefresh={fetchEyeCatchers}
            isLoading={isLoading}
            setError={setError}
            theme={resolvedTheme}
          />
        )}
      </div>
    </div>
  );
};

export default EyeCatchersView;