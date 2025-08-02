"use client";

import React, { useState } from 'react';
import WebhooksHeader from './WebhooksViewHeader';
import AddWebhookForm from './AddWebhookForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Webhook {
  id: number;
  userId: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

const WebhooksView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

  const handleAddClick = () => {
    setEditingWebhook(null);
    setShowAddForm(true);
  };

  const handleEditClick = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingWebhook(null);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {showAddForm ? (
        <AddWebhookForm
          onSave={() => setShowAddForm(false)}
          onCancel={handleCancel}
          editingWebhook={editingWebhook}
        />
      ) : (
        <WebhooksHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default WebhooksView;