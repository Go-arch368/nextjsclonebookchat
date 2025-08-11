
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import SmartResponsesHeader from './SmartResponsesHeader';
import AddSmartResponseForm from './AddSmartResponseForm';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = '/api/v1/settings/smart-responses';

  useEffect(() => {
    const fetchSmartResponses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<SmartResponse[]>(`${API_BASE_URL}?action=list`);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Expected an array');
        }
        setSmartResponses(response.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.status === 404
            ? 'Smart responses API route not found. Please check the server configuration.'
            : err.response?.data?.message || err.message || 'Failed to load smart responses';
        console.error('Fetch error:', errorMessage, err.response?.data);
        setError(errorMessage);
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
        setSmartResponses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSmartResponses();
  }, []);

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

      const url = API_BASE_URL; // Use base URL for both POST and PUT
      const method = newSmartResponse.id ? 'PUT' : 'POST';

      const response = await axios({
        method,
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
      toast.success(
        newSmartResponse.id ? 'Smart response updated successfully!' : 'Smart response created successfully!',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Smart responses API route not found. Please check the server configuration.'
          : err.response?.status === 405
          ? 'Method not allowed. Please check the API configuration.'
          : err.response?.data?.message || err.message || 'Failed to save smart response';
      console.error('Save error:', errorMessage, err.response?.data);
      setError(errorMessage);
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('for key \'shortcuts\'')) {
        const shortcutMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'shortcuts'/);
        const shortcut = shortcutMatch ? shortcutMatch[1] : newSmartResponse.shortcuts.join(', ');
        toast.error(`Shortcut "${shortcut}" already exists`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      await axios.delete(`${API_BASE_URL}?id=${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSmartResponses((prev) => prev.filter((item) => item.id !== id));
      toast.success('Smart response deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Smart responses API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete smart response';
      console.error('Delete error:', errorMessage, err.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, {
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
