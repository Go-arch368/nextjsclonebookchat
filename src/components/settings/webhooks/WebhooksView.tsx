
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
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingWebhook(null);
    setShowAddForm(true);
    setError(null);
  };

  const handleEditClick = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setShowAddForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingWebhook(null);
    setError(null);
  };

  return (
    <div className="webhooks-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {error && (
        <div className="error-message p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {showAddForm ? (
        <AddWebhookForm
          onSave={() => {
            setShowAddForm(false);
            setEditingWebhook(null);
          }}
          onCancel={handleCancel}
          editingWebhook={editingWebhook}
          webhooks={webhooks}
          setWebhooks={setWebhooks}
          setError={setError}
        />
      ) : (
        <WebhooksHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          webhooks={webhooks}
          setWebhooks={setWebhooks}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
        />
      )}
    </div>
  );
};

export default WebhooksView;
