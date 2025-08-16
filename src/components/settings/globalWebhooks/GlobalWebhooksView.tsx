"use client";

import React, { useState } from 'react';
import GlobalWebhooksHeader from './GlobalWebhooksHeader';
import AddGlobalWebhookForm from './AddGlobalWebhookForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

interface GlobalWebhook {
  id: number;
  userId: number;
  event: string;
  dataTypeEnabled: boolean;
  destination: 'TARGET_URL' | 'EMAIL' | 'BOTH';
  email: string;
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

const GlobalWebhooksView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<GlobalWebhook | null>(null);
  const { theme } = useTheme();

  const handleAddClick = () => {
    setEditingWebhook(null);
    setShowAddForm(true);
  };

  const handleEditClick = (webhook: GlobalWebhook) => {
    setEditingWebhook(webhook);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingWebhook(null);
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
        <AddGlobalWebhookForm
          onSave={() => setShowAddForm(false)}
          onCancel={handleCancel}
          editingWebhook={editingWebhook}
        />
      ) : (
        <GlobalWebhooksHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default GlobalWebhooksView;