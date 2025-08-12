"use client";

import React, { useState, useEffect } from 'react';
import WebhooksHeader from './WebhooksViewHeader';
import AddWebhookForm from './AddWebhookForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

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
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/settings/webhooks');
      const data = await response.json();
      setWebhooks(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch webhooks');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

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

  const handleSave = async (webhook: Webhook) => {
    try {
      setIsLoading(true);
      setError(null);

      const method = webhook.id ? 'PUT' : 'POST';
      const apiResponse = await fetch(`/api/v1/settings/webhooks`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhook),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save webhook');
      }

      const savedWebhook = await apiResponse.json();
      setWebhooks(prev => 
        webhook.id
          ? prev.map(w => w.id === webhook.id ? savedWebhook : w)
          : [...prev, savedWebhook]
      );
      
      setShowAddForm(false);
      toast.success(webhook.id ? 'Updated successfully!' : 'Created successfully!');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/settings/webhooks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete webhook');
      }

      setWebhooks(prev => prev.filter(w => w.id !== id));
      toast.success('Deleted successfully!');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm ? (
        <AddWebhookForm
          onSave={handleSave}
          onCancel={handleCancel}
          editingWebhook={editingWebhook}
        />
      ) : (
        <WebhooksHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          webhooks={webhooks}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default WebhooksView;