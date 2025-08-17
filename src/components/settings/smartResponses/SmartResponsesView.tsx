"use client";

import React, { useState, useEffect } from 'react';
import SmartResponsesHeader from './SmartResponsesHeader';
import AddSmartResponseForm from './AddSmartResponseForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';

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
  const { resolvedTheme } = useTheme();
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Ensure all responses have proper arrays
      const validatedData = data.map((item: SmartResponse) => ({
        ...item,
        shortcuts: item.shortcuts || [],
        websites: item.websites || []
      }));
      setSmartResponses(validatedData);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch smart responses');
      console.error('Fetch error:', error);
      toast.error(error.message || 'Failed to fetch smart responses', {
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
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
      const endpoint = '/api/v1/settings/smart-responses';

      const apiResponse = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...response,
          shortcuts: response.shortcuts || [],
          websites: response.websites || []
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save smart response');
      }

      const savedResponse = await apiResponse.json();
      setSmartResponses(prev => 
        response.id
          ? prev.map(r => r.id === response.id ? {
              ...savedResponse,
              shortcuts: savedResponse.shortcuts || [],
              websites: savedResponse.websites || []
            } : r)
          : [...prev, {
              ...savedResponse,
              shortcuts: savedResponse.shortcuts || [],
              websites: savedResponse.websites || []
            }]
      );
      
      setShowAddForm(false);
      toast.success(response.id ? 'Updated successfully!' : 'Created successfully!', {
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message, {
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
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
      toast.success('Deleted successfully!', {
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message, {
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
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
      toast.success('All smart responses cleared!', {
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message, {
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
      <div className="container mx-auto px-4 py-8">
        {showAddForm ? (
          <AddSmartResponseForm
            onSave={handleSave}
            onCancel={handleCancel}
            editingResponse={editingResponse}
            smartResponses={smartResponses}
            theme={resolvedTheme}
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
            theme={resolvedTheme}
          />
        )}
      </div>
    </div>
  );
};

export default SmartResponsesView;