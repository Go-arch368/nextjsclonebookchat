
"use client";

import React, { useState } from 'react';
import QueuedMessagesHeader from './QueuedMessagesHeader';
import AddQueuedMessageForm from './AddQueuedMessageForm';

// TypeScript interface for the queued message
interface QueuedMessage {
  id: number;
  title: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  image?: string;
}

const QueuedMessagesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newQueuedMessage: QueuedMessage) => {
    setQueuedMessages((prev) => [...prev, newQueuedMessage]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddQueuedMessageForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <QueuedMessagesHeader
          onAddClick={handleAddClick}
          onAddQueuedMessage={handleSave}
          queuedMessages={queuedMessages}
        />
      )}
    </div>
  );
};

export default QueuedMessagesView;
