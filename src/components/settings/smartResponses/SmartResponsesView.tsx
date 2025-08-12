"use client";

import React, { useState, useEffect } from 'react';
import SmartResponsesHeader from './SmartResponsesHeader';
import AddSmartResponseForm from './AddSmartResponseForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSmartResponses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/settings/smart-responses');
      const data = await response.json();
      setSmartResponses(data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch smart responses');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartResponses();
  }, []);

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



const handleSave = async (response: SmartResponse) => {
  try {
    setIsLoading(true);
    setError(null);

    const method = response.id ? 'PUT' : 'POST';
    const endpoint = response.id 
      ? '/api/v1/settings/smart-responses'  // This will use the PUT method
      : '/api/v1/settings/smart-responses';

    const apiResponse = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to save smart response');
    }

    const savedResponse = await apiResponse.json();
    setSmartResponses(prev => 
      response.id
        ? prev.map(r => r.id === response.id ? savedResponse : r)
        : [...prev, savedResponse]
    );
    
    setShowAddForm(false);
    toast.success(response.id ? 'Updated successfully!' : 'Created successfully!');
  } catch (error: any) {
    setError(error.message);
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
};



  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/settings/smart-responses?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete smart response');
      }

      setSmartResponses(prev => prev.filter(r => r.id !== id));
      toast.success('Deleted successfully!');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/v1/settings/smart-responses?action=clear', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to clear smart responses');
      }

      setSmartResponses([]);
      toast.success('All smart responses cleared!');
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {showAddForm ? (
        <AddSmartResponseForm
          onSave={handleSave}
          onCancel={handleCancel}
          editingResponse={editingResponse}
          smartResponses={smartResponses}
        />
      ) : (
        <SmartResponsesHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
          smartResponses={smartResponses}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default SmartResponsesView;