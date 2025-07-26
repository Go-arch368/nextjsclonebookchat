
"use client";

import React, { useState } from 'react';
import TemplatesHeader from './TemplatesHeader';
import AddTemplateForm from './AddTemplateForm';

// TypeScript interface for the template
interface Template {
  id: number;
  businessCategory: string;
  businessSubcategory: string;
  createdBy: string;
  dateTime: string;
}

const TemplatesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newTemplate: Template) => {
    setTemplates((prev) => [...prev, newTemplate]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddTemplateForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <TemplatesHeader
          onAddClick={handleAddClick}
          onAddTemplate={handleSave}
          templates={templates}
        />
      )}
    </div>
  );
};

export default TemplatesView;
