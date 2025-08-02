"use client";

import React, { useState } from 'react';
import KnowledgeBaseHeader from './KnowledgeBaseHeader';
import AddKnowledgeBaseRecordForm from './AddKnowledgeBaseRecordForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [knowledgeBaseRecords, setKnowledgeBaseRecords] = useState<KnowledgeBaseRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<KnowledgeBaseRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingRecord(null);
    setShowAddForm(true);
    setError(null);
  };

  const handleEdit = (record: KnowledgeBaseRecord) => {
    setEditingRecord(record);
    setShowAddForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingRecord(null);
    setError(null);
  };

  const handleSave = async (record: KnowledgeBaseRecord) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const url = record.id 
        ? 'https://zotly.onrender.com/api/v1/settings/knowledge-bases/update'
        : 'https://zotly.onrender.com/api/v1/settings/knowledge-bases/save';
      
      const method = record.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...record,
          userId: 1,
          updatedAt: new Date().toISOString(),
          ...(!record.id && { createdAt: new Date().toISOString() })
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save record: ${response.status}`);
      }

      const savedRecord: KnowledgeBaseRecord = await response.json();
      setKnowledgeBaseRecords((prev) => 
        record.id
          ? prev.map((r) => (r.id === savedRecord.id ? savedRecord : r))
          : [...prev, savedRecord]
      );
      setShowAddForm(false);
      setEditingRecord(null);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://zotly.onrender.com/api/v1/settings/knowledge-bases/delete/${id}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete record: ${response.status}`);
      }

      setKnowledgeBaseRecords(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="knowledge-base-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {error && (
        <div className="error-message p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {showAddForm ? (
        <AddKnowledgeBaseRecordForm
          onSave={handleSave}
          onCancel={handleCancel}
          initialRecord={editingRecord}
        />
      ) : (
        <KnowledgeBaseHeader
          onAddClick={handleAddClick}
          onEditClick={handleEdit}
          onDelete={handleDelete}
          knowledgeBaseRecords={knowledgeBaseRecords}
          setKnowledgeBaseRecords={setKnowledgeBaseRecords}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseView;