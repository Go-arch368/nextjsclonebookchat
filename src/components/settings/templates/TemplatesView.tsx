"use client";

import React, { useState } from 'react';
import TemplatesHeader from './TemplatesHeader';
import AddTemplateForm from './AddTemplateForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TypeScript interface for the template
interface Template {
  id: number;
  userId: number;
  businessCategory: string;
  businessSubcategory: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const TemplatesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleAddClick = () => {
    setEditingTemplate(null);
    setShowAddForm(true);
  };

  const handleEditClick = (template: Template) => {
    setEditingTemplate(template);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTemplate(null);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {showAddForm ? (
        <AddTemplateForm
          onSave={() => setShowAddForm(false)}
          onCancel={handleCancel}
          editingTemplate={editingTemplate}
        />
      ) : (
        <TemplatesHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default TemplatesView;