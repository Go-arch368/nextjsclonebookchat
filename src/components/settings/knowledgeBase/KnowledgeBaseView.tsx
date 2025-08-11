"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import KnowledgeBaseHeader from './KnowledgeBaseHeader';
import AddKnowledgeBaseRecordForm from './AddKnowledgeBaseRecordForm';

// TypeScript interface for the knowledge base record
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
  const [showEditForm, setShowEditForm] = useState(false);
  const [knowledgeBaseRecords, setKnowledgeBaseRecords] = useState<KnowledgeBaseRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<KnowledgeBaseRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all knowledge base records
  const fetchKnowledgeBaseRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<KnowledgeBaseRecord[]>('/api/v1/settings/knowledge-bases?action=all');
      setKnowledgeBaseRecords(response.data || []);
      toast.success('Knowledge base records fetched successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch knowledge base records';
      setError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeBaseRecords();
  }, []);

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setSelectedRecord(null);
  };

  const handleEditClick = (record: KnowledgeBaseRecord) => {
    setSelectedRecord(record);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedRecord(null);
  };

  const handleSave = async (record: KnowledgeBaseRecord) => {
    try {
      const response = await axios.post<KnowledgeBaseRecord>('/api/v1/settings/knowledge-bases?action=save', {
        ...record,
        userId: record.userId || 1, // Default userId
        createdAt: record.createdAt || new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      await fetchKnowledgeBaseRecords();
      setShowAddForm(false);
      toast.success('Knowledge base record added successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save knowledge base record';
      setError(message);
      toast.error(message);
      console.error(err);
    }
  };

  const handleUpdate = async (record: KnowledgeBaseRecord) => {
    try {
      const response = await axios.put<KnowledgeBaseRecord>('/api/v1/settings/knowledge-bases?action=update', {
        ...record,
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      await fetchKnowledgeBaseRecords();
      setShowEditForm(false);
      setSelectedRecord(null);
      toast.success('Knowledge base record updated successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update knowledge base record';
      setError(message);
      toast.error(message);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/v1/settings/knowledge-bases?action=delete&id=${id}`);
      await fetchKnowledgeBaseRecords();
      toast.success('Knowledge base record deleted successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete knowledge base record';
      setError(message);
      toast.error(message);
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('/api/v1/settings/knowledge-bases?action=delete-all');
      setKnowledgeBaseRecords([]);
      toast.success('All knowledge base records deleted successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete all knowledge base records';
      setError(message);
      toast.error(message);
      console.error(err);
    }
  };

  const handleSearch = async (keyword: string, page: number = 0, size: number = 5) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<KnowledgeBaseRecord[]>(
        `/api/v1/settings/knowledge-bases?action=search&keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
      );
      setKnowledgeBaseRecords(response.data || []);
      toast.success(`Found ${response.data.length} knowledge base record(s)`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to search knowledge base records';
      setError(message);
      toast.error(message);
      console.error(err);
      setKnowledgeBaseRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showAddForm || showEditForm ? (
        <AddKnowledgeBaseRecordForm
          onSave={showEditForm ? handleUpdate : handleSave}
          onCancel={handleCancel}
          initialRecord={showEditForm ? selectedRecord : null}
        />
      ) : (
        <KnowledgeBaseHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
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