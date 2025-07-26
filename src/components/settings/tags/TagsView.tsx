
"use client";

import React, { useState } from 'react';
import TagsViewHeader from './TagsViewHeader';
import AddTagForm from './AddTagForm';

// TypeScript interface for the tag
interface Tag {
  id: number;
  tag: string;
  isDefault: boolean;
}

const TagsView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSave = (newTag: Tag) => {
    setTags((prev) => [...prev, newTag]);
    setShowAddForm(false);
  };

  return (
    <div>
      {showAddForm ? (
        <AddTagForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <TagsViewHeader
          onAddClick={handleAddClick}
          onAddTag={handleSave}
          tags={tags}
        />
      )}
    </div>
  );
};

export default TagsView;
