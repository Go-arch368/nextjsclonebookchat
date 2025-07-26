
"use client";

import React, { useState } from 'react';
import GlobalWebhooksHeader from './GlobalWebhooksHeader';
import AddGlobalWebhookForm from './AddGlobalWebhookForm';
// TypeScript interface for the global webhook
interface GlobalWebhook {
  id: number;
  event: string;
  dataType: boolean;
  destination: string;
}

const GlobalWebhooksView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [globalWebhooks, setGlobalWebhooks] = useState<GlobalWebhook[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newGlobalWebhook: GlobalWebhook) => {
    setGlobalWebhooks((prev) => [...prev, newGlobalWebhook]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddGlobalWebhookForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <GlobalWebhooksHeader
          onAddClick={handleAddClick}
          onAddGlobalWebhook={handleSave}
          globalWebhooks={globalWebhooks}
        />
      )}
    </div>
  );
};

export default GlobalWebhooksView;
