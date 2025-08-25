"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import GreetingHeader from './GreetingHeader';
import AddGreetingForm from './AddGreetingForm';
import { useUserStore } from '@/stores/useUserStore';
interface Greeting {
  id?: number;
  userId?: number;
  title: string;
  greeting: string;
  type: string;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const GreetingsView: React.FC = () => {
  const {user} = useUserStore()
  const [showAddForm, setShowAddForm] = useState(false);
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [editingGreeting, setEditingGreeting] = useState<Greeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = '/api/settings/greetings';

  useEffect(() => {
    const fetchGreetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<Greeting[]>(`${API_BASE_URL}?action=list`);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Expected an array');
        }
        setGreetings(response.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.status === 404
            ? 'Greetings API route not found. Please check the server configuration.'
            : err.response?.data?.message || err.message || 'Failed to load greetings';
        console.error('Fetch error:', errorMessage, err.response?.data);
        setError(errorMessage);
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
        setGreetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGreetings();
  }, []);

  const handleAddClick = () => {
    setEditingGreeting(null);
    setShowAddForm(true);
    setError(null);
  };

  const handleEdit = (greeting: Greeting) => {
    setEditingGreeting(greeting);
    setShowAddForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingGreeting(null);
    setError(null);
  };

  const handleSave = async (greeting: Greeting) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const url = greeting.id ? `${API_BASE_URL}` : `${API_BASE_URL}`;
      const method = greeting.id ? 'PUT' : 'POST';
      
      const response = await axios({
        method,
        url,
        data: {
          ...greeting,
          userId: user?.id ?? 0,
          updatedAt: new Date().toISOString(),
          ...(!greeting.id && { createdAt: new Date().toISOString() })
        },
        headers: { 'Content-Type': 'application/json' },
      });

      const savedGreeting: Greeting = response.data;
      setGreetings((prev) => 
        greeting.id
          ? prev.map((g) => (g.id === savedGreeting.id ? savedGreeting : g))
          : [...prev, savedGreeting]
      );
      setShowAddForm(false);
      setEditingGreeting(null);
      toast.success(
        response.data?.message ||
        (typeof response.data === 'object' && 'title' in response.data
          ? `Greeting ${response.data.title} saved successfully!`
          : 'Greeting saved successfully!'),
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Greetings API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to save greeting';
      console.error('Save error:', errorMessage, err.response?.data);
      setError(errorMessage);
      if (errorMessage.includes('Duplicate entry') && errorMessage.includes('for key \'title\'')) {
        const titleMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'title'/);
        const title = titleMatch ? titleMatch[1] : greeting.title;
        toast.error(`Greeting with title '${title}' already exists`, {
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
      
      const response = await axios.delete(`${API_BASE_URL}?id=${id}`);
      setGreetings(prev => prev.filter(g => g.id !== id));
      toast.success(
        response.data?.message || 'Greeting deleted successfully!',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Greetings API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete greeting';
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
    <div className="container mx-auto">
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {showAddForm ? (
        <AddGreetingForm
          onSave={handleSave}
          onCancel={handleCancel}
          initialGreeting={editingGreeting}
        />
      ) : (
        <GreetingHeader
          onAddClick={handleAddClick}
          onEditClick={handleEdit}
          onDelete={handleDelete}
          greetings={greetings}
          isLoading={isLoading}
          setError={setError}
        />
      )}
    </div>
  );
};

export default GreetingsView;