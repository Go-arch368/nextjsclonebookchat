
"use client";

import React, { useState } from 'react';
import EyeCatcherHeader from './EyeCatherHeader';
import AddEyeCatcherForm from './AddEyeCatcherForm';

// TypeScript interface for the eye catcher
interface EyeCatcher {
  id: number;
  title: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  image?: string;
}

const EyeCatchersView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [eyeCatchers, setEyeCatchers] = useState<EyeCatcher[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newEyeCatcher: EyeCatcher) => {
    setEyeCatchers((prev) => [...prev, newEyeCatcher]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddEyeCatcherForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <EyeCatcherHeader
          onAddClick={handleAddClick}
          onAddEyeCatcher={handleSave} // Added missing prop
          eyeCatchers={eyeCatchers}
        />
      )}
    </div>
  );
};

export default EyeCatchersView;
