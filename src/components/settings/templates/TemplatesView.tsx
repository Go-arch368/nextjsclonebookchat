"use client";

import React, { useState, useEffect } from 'react';
import TemplatesHeader from './TemplatesHeader';
import AddTemplateForm from './AddTemplateForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

interface Template {
  id: number;
  userId: number;
  businessCategory: string;
  businessSubcategory: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

const TemplatesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/settings/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleAddClick = () => {
    setEditingTemplate(null);
    setShowAddForm(true);
  };

  const handleEditClick = (template: Template) => {
    setEditingTemplate(template);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/settings/templates?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
      
      await fetchTemplates();
      toast.success('Template deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete template');
    }
  };

  const handleSave = async () => {
    await fetchTemplates();
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTemplate(null);
  };

  return (
    <div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      {showAddForm ? (
        <AddTemplateForm
          onSave={handleSave}
          onCancel={handleCancel}
          editingTemplate={editingTemplate}
        />
      ) : (
        <TemplatesHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          templates={templates}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default TemplatesView;