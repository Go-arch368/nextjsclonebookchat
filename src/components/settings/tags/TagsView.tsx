
"use client";

import React, { useState } from 'react';
import TagsViewHeader from './TagsViewHeader';
import AddTagForm from './AddTagForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingTag(null);
    setShowAddForm(true);
    setError(null);
  };

  const handleEditClick = (tag: Tag) => {
    setEditingTag(tag);
    setShowAddForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTag(null);
    setError(null);
  };

  return (
    <div className="tags-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {error && (
        <div className="error-message p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {showAddForm ? (
        <AddTagForm
          onSave={() => {
            setShowAddForm(false);
            setEditingTag(null);
          }}
          onCancel={handleCancel}
          editingTag={editingTag}
          tags={tags}
          setTags={setTags}
          setError={setError}
        />
      ) : (
        <TagsViewHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          tags={tags}
          setTags={setTags}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
        />
      )}
    </div>
  );
};

export default TagsView;
