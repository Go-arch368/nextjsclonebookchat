"use client";

import React, { useState, useEffect } from 'react';
import KnowledgeBaseHeader from './KnowledgeBaseHeader';
import AddKnowledgeBaseRecordForm from './AddKnowledgeBaseRecordForm';
import { toast } from 'sonner';

interface KnowledgeBaseRecord {
  id?: number;
  userId?: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
  websites: string[];
  createdAt?: string;
  updatedAt?: string;
}

const KnowledgeBaseView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KnowledgeBaseRecord | null>(null);
  const [knowledgeBaseRecords, setKnowledgeBaseRecords] = useState<KnowledgeBaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKnowledgeBaseRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/settings/knowledge-bases?action=all');
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge base records');
      }
      const data = await response.json();
      setKnowledgeBaseRecords(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch knowledge base records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeBaseRecords();
  }, []);

  const handleAddClick = () => {
    setEditingRecord(null);
    setShowAddForm(true);
  };

  const handleEditClick = (record: KnowledgeBaseRecord) => {
    setEditingRecord(record);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/settings/knowledge-bases?action=delete&id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete knowledge base record');
      }
      
      await fetchKnowledgeBaseRecords();
      toast.success('Knowledge base record deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete knowledge base record');
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete all knowledge base records? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/v1/settings/knowledge-bases?action=delete-all', {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete all knowledge base records');
        }
        
        setKnowledgeBaseRecords([]);
        toast.success('All knowledge base records deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete all knowledge base records');
      }
    }
  };

  const handleSearch = async (keyword: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/settings/knowledge-bases?action=search&keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error('Failed to search knowledge base records');
      }
      const data = await response.json();
      setKnowledgeBaseRecords(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to search knowledge base records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (record: KnowledgeBaseRecord) => {
    try {
      const url = '/api/v1/settings/knowledge-bases';
      const method = editingRecord ? 'PUT' : 'POST';
      const action = editingRecord ? 'update' : 'save';
      
      const response = await fetch(`${url}?action=${action}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error(editingRecord 
          ? 'Failed to update knowledge base record' 
          : 'Failed to create knowledge base record');
      }

      toast.success(editingRecord 
        ? 'Knowledge base record updated successfully' 
        : 'Knowledge base record created successfully');
      
      await fetchKnowledgeBaseRecords();
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingRecord(null);
  };

  return (
    <div>
      {showAddForm ? (
        <AddKnowledgeBaseRecordForm
          onSave={handleSave}
          onCancel={handleCancel}
          initialRecord={editingRecord}
        />
      ) : (
        <KnowledgeBaseHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onSearch={handleSearch}
          knowledgeBaseRecords={knowledgeBaseRecords}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseView;