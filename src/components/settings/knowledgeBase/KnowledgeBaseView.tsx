
"use client";

import React, { useState } from 'react';
import KnowledgeBaseHeader from './KnowledgeBaseHeader';
import AddKnowledgeBaseRecordForm from './AddKnowledgeBaseRecordForm';

// TypeScript interface for the knowledge base record
interface KnowledgeBaseRecord {
  id: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
  websites: string;
}

const KnowledgeBaseView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [records, setRecords] = useState<KnowledgeBaseRecord[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newRecord: KnowledgeBaseRecord) => {
    setRecords((prev) => [...prev, newRecord]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddKnowledgeBaseRecordForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <KnowledgeBaseHeader
          onAddClick={handleAddClick}
          onAddRecord={handleSave}
          records={records}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseView;
