"use client";

import React, { useState, useEffect } from 'react';
import GreetingHeader from './GreetingHeader';
import AddGreetingForm from './AddGreetingForm';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [editingGreeting, setEditingGreeting] = useState<Greeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGreetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/greetings/list`);
        if (!response.ok) throw new Error(`Failed to fetch greetings: ${response.status}`);
        const data = await response.json();
        setGreetings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load greetings');
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
      
      const url = greeting.id 
        ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/greetings/update`
        : `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/greetings/save`;
      
      const method = greeting.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...greeting,
          userId: 1,
          updatedAt: new Date().toISOString(),
          ...(!greeting.id && { createdAt: new Date().toISOString() })
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save greeting: ${response.status}`);
      }

      const savedGreeting: Greeting = await response.json();
      setGreetings((prev) => 
        greeting.id
          ? prev.map((g) => (g.id === savedGreeting.id ? savedGreeting : g))
          : [...prev, savedGreeting]
      );
      setShowAddForm(false);
      setEditingGreeting(null);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save greeting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/greetings/delete/${id}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete greeting: ${response.status}`);
      }

      setGreetings(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete greeting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="greetings-container">
      {error && (
        <div className="error-message p-4 mb-4 bg-red-100 text-red-700 rounded">
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