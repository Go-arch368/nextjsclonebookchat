"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import KnowledgeBaseHeader from './KnowledgeBaseHeader';
import AddKnowledgeBaseRecordForm from './AddKnowledgeBaseRecordForm';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

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
  const { theme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KnowledgeBaseRecord | null>(null);
  const [knowledgeBaseRecords, setKnowledgeBaseRecords] = useState<KnowledgeBaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In KnowledgeBaseView component
const fetchKnowledgeBaseRecords = async () => {
  try {
    setIsLoading(true);
    const response = await fetch('/api/v1/settings/knowledge-bases?action=all');
    
    if (response.ok) {
      const data = await response.json();
      // Ensure we always set an array
      setKnowledgeBaseRecords(Array.isArray(data) ? data : []);
    } else {
      console.warn('Failed to fetch records, keeping existing data');
      // Ensure we have an array even on error
      setKnowledgeBaseRecords(prev => Array.isArray(prev) ? prev : []);
    }
  } catch (error: any) {
    console.warn('Fetch failed, keeping existing data:', error);
    setKnowledgeBaseRecords(prev => Array.isArray(prev) ? prev : []);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => { 
    fetchKnowledgeBaseRecords(); 
  }, []);

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
        const errorText = await response.text();
        throw new Error(errorText || 'Operation failed');
      }

      const savedRecord = await response.json();
      
      // Update UI immediately for better UX
      if (editingRecord) {
        setKnowledgeBaseRecords(prev => 
          prev.map(r => r.id === savedRecord.id ? savedRecord : r)
        );
      } else {
        setKnowledgeBaseRecords(prev => [savedRecord, ...prev]);
      }

      toast.success(editingRecord ? 'Record updated successfully!' : 'Record created successfully!');
      setShowAddForm(false);
      setEditingRecord(null);
      
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while saving');
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `/api/v1/settings/knowledge-bases?action=delete&id=${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete record');
      }

      // Update UI immediately
      setKnowledgeBaseRecords(prev => prev.filter(record => record.id !== id));
      toast.success('Record deleted successfully!');
      
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL records? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(
        '/api/v1/settings/knowledge-bases?action=delete-all',
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete all records');
      }

      setKnowledgeBaseRecords([]);
      toast.success('All records deleted successfully!');
      
    } catch (error: any) {
      toast.error(error.message || 'Delete all failed');
    }
  };

  const handleSearch = async (keyword: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/settings/knowledge-bases?action=search&keyword=${encodeURIComponent(keyword)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setKnowledgeBaseRecords(data || []);
      }
    } catch (error: any) {
      console.warn('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      {showAddForm ? (
        <AddKnowledgeBaseRecordForm
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            setEditingRecord(null);
          }}
          initialRecord={editingRecord}
        />
      ) : (
        <KnowledgeBaseHeader
          onAddClick={() => {
            setEditingRecord(null);
            setShowAddForm(true);
          }}
          onEditClick={(record) => {
            setEditingRecord(record);
            setShowAddForm(true);
          }}
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