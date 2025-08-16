"use client";

import React, { useState } from 'react';
import TagsViewHeader from './TagsViewHeader';
import AddTagForm from './AddTagForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

interface Tag {
  id: number;
  userId: number;
  tag: string;
  isDefault: boolean;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

const TagsView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const { theme } = useTheme();

  const handleAddClick = () => {
    setEditingTag(null);
    setShowAddForm(true);
  };

  const handleEditClick = (tag: Tag) => {
    setEditingTag(tag);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTag(null);
  };

  return (
    <div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      {showAddForm ? (
        <AddTagForm
          onSave={() => setShowAddForm(false)}
          onCancel={handleCancel}
          editingTag={editingTag}
        />
      ) : (
        <TagsViewHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default TagsView;