"use client";

import React, { useState } from 'react';
import QueuedMessagesHeader from './QueuedMessagesHeader';
import AddQueuedMessageForm from './AddQueuedMessageForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TypeScript interface for the queued message
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

  const handleSave = (newQueuedMessage: QueuedMessage) => {
    setQueuedMessages((prev) => {
      if (editingMessage) {
        // Update existing message
        return prev.map((item) => (item.id === newQueuedMessage.id ? newQueuedMessage : item));
      }
      // Add new message
      return [...prev, newQueuedMessage];
    });
    setShowAddForm(false);
    setEditingMessage(null);
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
          queuedMessages={queuedMessages}
          setQueuedMessages={setQueuedMessages}
        />
      )}
    </div>
  );
};

export default QueuedMessagesView;