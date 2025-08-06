"use client";

import React, { useState, useEffect } from 'react';
import EyeCatcherHeader from './EyeCatherHeader';
import AddEyeCatcherForm from './AddEyeCatcherForm';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEyeCatcher, setEditingEyeCatcher] = useState<EyeCatcher | null>(null);
  const [eyeCatchers, setEyeCatchers] = useState<EyeCatcher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEyeCatchers();
  }, []);

  const fetchEyeCatchers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/eye-catchers/list`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Failed to fetch eye catchers: ${response.status}`);
      const data = await response.json();
      setEyeCatchers(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch eye catchers');
      console.error('Error fetching eye catchers:', error);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}settings/eye-catchers/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save eye catcher: ${response.status}`);
      }
      const savedEyeCatcher: EyeCatcher = await response.json();
      setEyeCatchers((prev) => [...prev, savedEyeCatcher]);
      setShowAddForm(false);
    } catch (error: any) {
      setError(error.message || 'Failed to add eye catcher. Please check the input data and try again.');
      console.error('Error saving eye catcher:', error);
    }
  };

  const handleUpdate = async (eyeCatcher: EyeCatcher) => {
    try {
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/eye-catchers/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });
      if (!response.ok) throw new Error(`Failed to update eye catcher: ${response.status}`);
      const updatedEyeCatcher = await response.json();
      setEyeCatchers((prev) =>
        prev.map((item) => (item.id === updatedEyeCatcher.id ? updatedEyeCatcher : item))
      );
      setShowEditForm(false);
      setEditingEyeCatcher(null);
    } catch (error: any) {
      setError(error.message || 'Failed to update eye catcher');
      console.error('Error updating eye catcher:', error);
    }
  };

  return (
    <div>
      {error && (
        <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">{error}</div>
      )}
      {showAddForm ? (
        <AddEyeCatcherForm
          onSave={handleSave}
          onCancel={handleCancel}
          isEditMode={false}
        />
      ) : showEditForm && editingEyeCatcher ? (
        <AddEyeCatcherForm
          onSave={handleUpdate as (eyeCatcher: EyeCatcher | Omit<EyeCatcher, 'id' | 'imageUrl'>) => void}
          onCancel={handleCancel}
          initialData={editingEyeCatcher}
          isEditMode={true}
        />
      ) : (
        <EyeCatcherHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          eyeCatchers={eyeCatchers}
          onRefresh={fetchEyeCatchers}
          isLoading={isLoading}
          setError={setError}
        />
      )}
    </div>
  );
};

export default EyeCatchersView;