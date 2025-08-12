"use client";

import React, { useState, useEffect } from 'react';
import QueuedMessagesHeader from './QueuedMessagesHeader';
import AddQueuedMessageForm from './AddQueuedMessageForm';
import { ToastContainer,toast } from 'react-toastify';
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

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/settings/queued-messages');
      const data = await response.json();
      setQueuedMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleAddClick = () => {
    setEditingMessage(null);
    setShowAddForm(true);
  };

  const handleEditClick = (message: QueuedMessage) => {
    setEditingMessage(message);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingMessage(null);
  };

  const handleSave = async (message: QueuedMessage) => {
    try {
      const method = editingMessage ? 'PUT' : 'POST';
      const response = await fetch('/api/v1/settings/queued-messages', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      
      if (!response.ok) throw new Error('Failed to save message');
      
      fetchMessages();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

const handleDelete = async (id: number) => {
  try {
    const response = await fetch(`/api/v1/settings/queued-messages?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete message');
    }
    
    // No need to parse JSON if we're not expecting a response body
    fetchMessages(); // Refresh the list
    
    toast.success('Message deleted successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    toast.error(error.message || 'Failed to delete message', {
      position: 'top-right',
      autoClose: 3000,
    });
  }
};

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {showAddForm ? (
        <AddQueuedMessageForm
          onSave={handleSave}
          onCancel={handleCancel}
          editingMessage={editingMessage}
        />
      ) : (
        <QueuedMessagesHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          queuedMessages={queuedMessages}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default QueuedMessagesView;