"use client";

import React, { useState, useEffect } from 'react';
import WebhooksHeader from './WebhooksViewHeader';
import AddWebhookForm from './AddWebhookForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

interface Webhook {
  id?: number;
  userId?: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt?: string;
  updatedAt?: string;
}

const WebhooksView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/settings/webhooks');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch webhooks');
      }
      
      const data: Webhook[] = await response.json();
      console.log('Fetched webhooks:', data);
      setWebhooks(data);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch webhooks';
      setError(message);
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
      const endpoint = '/api/v1/settings/webhooks';

      console.log('Saving webhook:', webhook);

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...webhook,
          userId: webhook.userId || 1,
          dataTypes: webhook.dataTypes || [],
          createdAt: webhook.id ? webhook.createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save webhook');
      }

      const savedWebhook = await response.json();
      console.log('Saved webhook response:', savedWebhook);

      // Refresh the list
      await fetchWebhooks();
      
      setShowAddForm(false);
      setEditingWebhook(null);
      
      toast.success(webhook.id ? 'Webhook updated successfully!' : 'Webhook created successfully!', {
        theme: theme === 'dark' ? 'dark' : 'light',
      });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save webhook';
      setError(message);
      toast.error(message, {
        theme: theme === 'dark' ? 'dark' : 'light',
      });
      console.error('Save error:', error);
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
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete webhook');
      }

      // Update local state immediately
      setWebhooks(prev => prev.filter(w => w.id !== id));
      
      toast.success('Webhook deleted successfully!', {
        theme: theme === 'dark' ? 'dark' : 'light',
      });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete webhook';
      setError(message);
      toast.error(message, {
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
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