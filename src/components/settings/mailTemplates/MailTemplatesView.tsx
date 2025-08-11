"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import MailTemplatesHeader from './MailTemplatesHeader';
import AddMailTemplateForm from './AddMailTemplateForm';

// TypeScript interface for the mail template
interface MailTemplate {
  id: number;
  userId: number;
  name: string;
  useCase: string;
  subject: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

const MailTemplatesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all templates
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<MailTemplate[]>('/api/v1/settings/mail-templates?action=all');
      setTemplates(response.data || []);
      toast.success('Templates fetched successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch templates');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setSelectedTemplate(null);
  };

  const handleEditClick = (template: MailTemplate) => {
    setSelectedTemplate(template);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedTemplate(null);
  };

  const handleSave = async (template: Omit<MailTemplate, 'id' | 'createdAt' | 'modifiedAt'>) => {
    try {
      const response = await axios.post<MailTemplate>('/api/v1/settings/mail-templates?action=save', {
        ...template,
        userId: template.userId || 1, // Default userId
        createdAt: new Date().toISOString().slice(0, 19),
        modifiedAt: new Date().toISOString().slice(0, 19),
      });
      await fetchTemplates();
      setShowAddForm(false);
      toast.success('Template added successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save template');
      console.error(err);
    }
  };

  const handleUpdate = async (template: MailTemplate) => {
    try {
      const response = await axios.put<MailTemplate>('/api/v1/settings/mail-templates?action=update', {
        ...template,
        modifiedAt: new Date().toISOString().slice(0, 19),
      });
      await fetchTemplates();
      setShowEditForm(false);
      setSelectedTemplate(null);
      toast.success('Template updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update template');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/v1/settings/mail-templates?action=delete&id=${id}`);
      await fetchTemplates();
      toast.success('Template deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete template');
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('/api/v1/settings/mail-templates?action=delete-all');
      setTemplates([]);
      toast.success('All templates deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete all templates');
      console.error(err);
    }
  };

  const handleSearch = async (keyword: string, page: number = 0, size: number = 10) => {
    try {
      setIsLoading(true);
      const response = await axios.get<MailTemplate[]>(
        `/api/v1/settings/mail-templates?action=search&keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
      );
      setTemplates(response.data || []);
      toast.success(`Found ${response.data.length} template(s)`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to search templates');
      console.error(err);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showAddForm || showEditForm ? (
        <AddMailTemplateForm
          onSave={showEditForm ? handleUpdate : handleSave}
          onCancel={handleCancel}
          template={showEditForm ? selectedTemplate : null}
        />
      ) : (
        <MailTemplatesHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onSearch={handleSearch}
          templates={templates}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default MailTemplatesView;