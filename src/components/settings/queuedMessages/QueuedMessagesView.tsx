"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import QueuedMessagesHeader from './QueuedMessagesHeader';
import AddQueuedMessageForm from './AddQueuedMessageForm';
import 'react-toastify/dist/ReactToastify.css';

interface QueuedMessage {
  id: number;
  userId: number;
  message: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

const QueuedMessagesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>([]);
  const [editingMessage, setEditingMessage] = useState<QueuedMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = '/api/v1/settings/queued-messages';

  useEffect(() => {
    const fetchQueuedMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<QueuedMessage[]>(`${API_BASE_URL}?action=list`);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Expected an array');
        }
        setQueuedMessages(response.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.status === 404
            ? 'Queued messages API route not found. Please check the server configuration.'
            : err.response?.data?.message || err.message || 'Failed to load queued messages';
        console.error('Fetch error:', errorMessage, err.response?.data);
        setError(errorMessage);
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
        setQueuedMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueuedMessages();
  }, []);

  const handleAddClick = () => {
    setEditingMessage(null);
    setShowAddForm(true);
    setError(null);
  };

  const handleEdit = (message: QueuedMessage) => {
    setEditingMessage(message);
    setShowAddForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingMessage(null);
    setError(null);
  };

  const handleSave = async (queuedMessage: QueuedMessage) => {
    try {
      setIsLoading(true);
      setError(null);

      const url = API_BASE_URL; // Use base URL for both POST and PUT
      const method = queuedMessage.id ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: {
          ...queuedMessage,
          userId: 1,
          updatedAt: new Date().toISOString(),
          ...(!queuedMessage.id && { createdAt: new Date().toISOString() }),
        },
        headers: { 'Content-Type': 'application/json' },
      });

      const savedMessage: QueuedMessage = response.data;
      setQueuedMessages((prev) =>
        queuedMessage.id
          ? prev.map((m) => (m.id === savedMessage.id ? savedMessage : m))
          : [...prev, savedMessage]
      );
      setShowAddForm(false);
      setEditingMessage(null);
      toast.success(
        response.data?.message ||
        (typeof response.data === 'object' && 'message' in response.data
          ? `Queued message "${response.data.message}" saved successfully!`
          : 'Queued message saved successfully!'),
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Queued messages API route not found. Please check the server configuration.'
          : err.response?.status === 405
          ? 'Method not allowed. Please check the API configuration.'
          : err.response?.data?.message || err.message || 'Failed to save queued message';
      console.error('Save error:', errorMessage, err.response?.data);
      setError(errorMessage);
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('for key \'message\'')) {
        const messageMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'message'/);
        const message = messageMatch ? messageMatch[1] : queuedMessage.message;
        toast.error(`Queued message "${message}" already exists`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.delete(`${API_BASE_URL}?id=${id}`);
      setQueuedMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success(
        response.data?.message || 'Queued message deleted successfully!',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Queued messages API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete queued message';
      console.error('Delete error:', errorMessage, err.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.delete(`${API_BASE_URL}?action=clear`);
      setQueuedMessages([]);
      toast.success(
        response.data?.message || 'All queued messages cleared successfully!',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Queued messages API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to clear queued messages';
      console.error('Clear error:', errorMessage, err.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="queued-messages-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {error && (
        <div className="error-message p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {showAddForm ? (
        <AddQueuedMessageForm
          onSave={handleSave}
          onCancel={handleCancel}
          initialMessage={editingMessage}
          setError={setError}
        />
      ) : (
        <QueuedMessagesHeader
          onAddClick={handleAddClick}
          onEditClick={handleEdit}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
          queuedMessages={queuedMessages}
          isLoading={isLoading}
          setError={setError}
        />
      )}
    </div>
  );
};

export default QueuedMessagesView;