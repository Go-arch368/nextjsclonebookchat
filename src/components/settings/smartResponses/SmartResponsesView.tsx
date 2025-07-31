"use client";

import React, { useState } from 'react';
import SmartResponsesHeader from './SmartResponsesHeader';
import AddSmartResponseForm from './AddSmartResponseForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TypeScript interface for the smart response
interface SmartResponse {
  id: number;
  userId: number;
  response: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  shortcuts: string[];
  websites: string[];
}

const SmartResponsesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [smartResponses, setSmartResponses] = useState<SmartResponse[]>([]);
  const [editingResponse, setEditingResponse] = useState<SmartResponse | null>(null);

  const handleAddClick = () => {
    setEditingResponse(null);
    setShowAddForm(true);
  };

  const handleEditClick = (response: SmartResponse) => {
    setEditingResponse(response);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingResponse(null);
  };

  const handleSave = (newSmartResponse: SmartResponse) => {
    setSmartResponses((prev) => {
      if (editingResponse) {
        // Update existing response
        return prev.map((item) => (item.id === newSmartResponse.id ? newSmartResponse : item));
      }
      // Add new response
      return [...prev, newSmartResponse];
    });
    setShowAddForm(false);
    setEditingResponse(null);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {showAddForm ? (
        <AddSmartResponseForm
          onSave={handleSave}
          onCancel={handleCancel}
          editingResponse={editingResponse}
        />
      ) : (
        <SmartResponsesHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          smartResponses={smartResponses}
          setSmartResponses={setSmartResponses}
        />
      )}
    </div>
  );
};

export default SmartResponsesView;