"use client";

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import IntegrationsHeader from './IntegrationsHeader';
import AddIntegrationForm from './AddIntegrationForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Integration {
  id: number;
  userId: number;
  service: 'ZAPIER' | 'DRIFT';
  website: string;
  apiKey: string;
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

const IntegrationsView: React.FC = () => {
  const { theme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);

  const handleAddClick = () => {
    setEditingIntegration(null);
    setShowAddForm(true);
  };

  const handleEditClick = (integration: Integration) => {
    setEditingIntegration(integration);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingIntegration(null);
  };

  return (
    <div >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {showAddForm ? (
        <AddIntegrationForm
          onSave={() => setShowAddForm(false)}
          onCancel={handleCancel}
          editingIntegration={editingIntegration}
        />
      ) : (
        <IntegrationsHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default IntegrationsView;