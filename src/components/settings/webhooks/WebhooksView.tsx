
"use client";

import React, { useState } from 'react';
import WebhooksViewHeader from './WebhooksViewHeader';
import AddWebhookForm from './AddWebhookForm';

// TypeScript interface for the webhook
interface Webhook {
  id: number;
  events: string[];
  dataTypes: string[];
  targetUrl: string;
}

const WebhooksView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newWebhook: Webhook) => {
    setWebhooks((prev) => [...prev, newWebhook]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddWebhookForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <WebhooksViewHeader
          onAddClick={handleAddClick}
          onAddWebhook={handleSave}
          webhooks={webhooks}
        />
      )}
    </div>
  );
};

export default WebhooksView;
