"use client";

import React, { useState, useEffect } from 'react';
import QueuedMessagesHeader from './QueuedMessagesHeader';
import AddQueuedMessageForm from './AddQueuedMessageForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

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
  const { resolvedTheme } = useTheme();
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
      toast.error('Failed to fetch messages', {
        position: 'top-right',
        autoClose: 3000,
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
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
    const isEditing = !!editingMessage;
    
    // Use the same endpoint but different HTTP methods
    const url = '/api/v1/settings/queued-messages';
    
    // Use POST for create, PUT for update
    const method = isEditing ? 'PUT' : 'POST';
    
    // For new messages, remove the ID to avoid confusion
    const payload = isEditing ? message : { ...message, id: undefined };
    
    console.log(`Sending ${method} request:`, payload);

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} message`);
    }

    // Success handling
    fetchMessages(); // Refresh the list
    setShowAddForm(false);
    setEditingMessage(null);
    
    toast.success(result.message || `Message ${isEditing ? 'updated' : 'created'} successfully`, {
      position: 'top-right',
      autoClose: 3000,
      theme: resolvedTheme === 'dark' ? 'dark' : 'light',
    });

  } catch (error: any) {
    console.error('Save error:', error);
    
    let errorMessage = error.message || 'Failed to save message';
    
    // Handle concurrency errors specifically
    if (error.message.includes('another transaction') || error.message.includes('unsaved-value')) {
      errorMessage = 'This message was modified by another process. Please refresh and try again.';
      fetchMessages(); // Force refresh
    }
    
    toast.error(errorMessage, {
      position: 'top-right',
      autoClose: 5000, // Longer timeout for error messages
      theme: resolvedTheme === 'dark' ? 'dark' : 'light',
    });
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
      
      fetchMessages();
      
      toast.success('Message deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(error.message || 'Failed to delete message', {
        position: 'top-right',
        autoClose: 3000,
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
    }
  };

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
      <div className="container mx-auto px-4 py-8">
        {showAddForm ? (
          <AddQueuedMessageForm
            onSave={handleSave}
            onCancel={handleCancel}
            editingMessage={editingMessage}
            theme={resolvedTheme}
          />
        ) : (
          <QueuedMessagesHeader
            onAddClick={handleAddClick}
            onEditClick={handleEditClick}
            onDelete={handleDelete}
            queuedMessages={queuedMessages}
            isLoading={isLoading}
            theme={resolvedTheme}
          />
        )}
      </div>
    </div>
  );
};

export default QueuedMessagesView;