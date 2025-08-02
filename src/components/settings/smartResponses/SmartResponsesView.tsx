
"use client";

import React, { useState } from 'react';
import SmartResponsesHeader from './SmartResponsesHeader';
import AddSmartResponseForm from './AddSmartResponseForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface SmartResponse {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingResponse(null);
    setShowAddForm(true);
    setError(null);
  };

  const handleEditClick = (response: SmartResponse) => {
    setEditingResponse(response);
    setShowAddForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingResponse(null);
    setError(null);
  };

  const handleSave = async (newSmartResponse: SmartResponse) => {
    try {
      setIsLoading(true);
      setError(null);

      const url = newSmartResponse.id
        ? 'https://zotly.onrender.com/api/v1/settings/smart-responses/put'
        : 'https://zotly.onrender.com/api/v1/settings/smart-responses/save';

      const response = await axios({
        method: newSmartResponse.id ? 'PUT' : 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
        data: {
          ...newSmartResponse,
          userId: 1,
          updatedAt: new Date().toISOString(),
          ...(!newSmartResponse.id && { createdAt: new Date().toISOString() }),
        },
      });

      setSmartResponses((prev) =>
        newSmartResponse.id
          ? prev.map((item) => (item.id === response.data.id ? response.data : item))
          : [...prev, response.data]
      );
      setShowAddForm(false);
      setEditingResponse(null);
      toast.success(newSmartResponse.id ? 'Smart response updated successfully!' : 'Smart response created successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to save smart response';
      console.error('Save error:', err);
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      await axios.delete(`https://zotly.onrender.com/api/v1/settings/smart-responses/delete/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSmartResponses((prev) => prev.filter((item) => item.id !== id));
      toast.success('Smart response deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete smart response';
      console.error('Delete error:', err);
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="smart-responses-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      {error && (
        <div className="error-message p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
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
          smartResponses={smartResponses}
          setSmartResponses={setSmartResponses}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
        />
      )}
    </div>
  );
};

export default SmartResponsesView;
