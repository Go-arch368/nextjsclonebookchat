
"use client";

import React, { useState } from 'react';
import MailTemplatesHeader from './MailTemplatesHeader';
import AddMailTemplateForm from './AddMailTemplateForm';

// TypeScript interface for the mail template
interface MailTemplate {
  id: number;
  name: string;
  useCase: string;
  subject: string;
  active: boolean;
}

const MailTemplatesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [templates, setTemplates] = useState<MailTemplate[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newTemplate: MailTemplate) => {
    setTemplates((prev) => [...prev, newTemplate]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddMailTemplateForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MailTemplatesHeader
          onAddClick={handleAddClick}
          onAddTemplate={handleSave}
          templates={templates}
        />
      )}
    </div>
  );
};

export default MailTemplatesView;