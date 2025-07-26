
"use client";

import React, { useState } from 'react';
import SmartResponsesHeader from './SmartResponsesHeader';
import AddSmartResponseForm from './AddSmartResponseForm';

// TypeScript interface for the smart response
interface SmartResponse {
  id: number;
  shortcuts: string[];
  response: string;
  websites: string[];
}

const SmartResponsesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [smartResponses, setSmartResponses] = useState<SmartResponse[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newSmartResponse: SmartResponse) => {
    setSmartResponses((prev) => [...prev, newSmartResponse]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddSmartResponseForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <SmartResponsesHeader
          onAddClick={handleAddClick}
          onAddSmartResponse={handleSave}
          smartResponses={smartResponses}
        />
      )}
    </div>
  );
};

export default SmartResponsesView;
