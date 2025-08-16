"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
  const { theme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KnowledgeBaseRecord | null>(null);
  const [knowledgeBaseRecords, setKnowledgeBaseRecords] = useState<KnowledgeBaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKnowledgeBaseRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/settings/knowledge-bases?action=all');
      if (!response.ok) throw new Error('Failed to fetch records');
      setKnowledgeBaseRecords(await response.json());
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchKnowledgeBaseRecords(); }, []);

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

      if (!response.ok) throw new Error(
        editingRecord ? 'Failed to update record' : 'Failed to create record'
      );

      toast.success(editingRecord ? 'Record updated' : 'Record created');
      await fetchKnowledgeBaseRecords();
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
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
          onDelete={async (id) => {
            try {
              const response = await fetch(
                `/api/v1/settings/knowledge-bases?action=delete&id=${id}`,
                { method: 'DELETE' }
              );
              if (!response.ok) throw new Error('Failed to delete');
              await fetchKnowledgeBaseRecords();
              toast.success('Record deleted');
            } catch (error: any) {
              toast.error(error.message || 'Delete failed');
            }
          }}
          onDeleteAll={async () => {
            if (confirm('Delete all records? This cannot be undone.')) {
              try {
                const response = await fetch(
                  '/api/v1/settings/knowledge-bases?action=delete-all',
                  { method: 'DELETE' }
                );
                if (!response.ok) throw new Error('Failed to delete all');
                setKnowledgeBaseRecords([]);
                toast.success('All records deleted');
              } catch (error: any) {
                toast.error(error.message || 'Delete all failed');
              }
            }
          }}
          onSearch={async (keyword) => {
            try {
              setIsLoading(true);
              const response = await fetch(
                `/api/v1/settings/knowledge-bases?action=search&keyword=${encodeURIComponent(keyword)}`
              );
              if (!response.ok) throw new Error('Search failed');
              setKnowledgeBaseRecords(await response.json());
            } catch (error: any) {
              toast.error(error.message || 'Search failed');
            } finally {
              setIsLoading(false);
            }
          }}
          knowledgeBaseRecords={knowledgeBaseRecords}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseView;