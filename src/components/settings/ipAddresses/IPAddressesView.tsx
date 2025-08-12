"use client";

import React, { useState, useEffect } from 'react';
import IPAddressesHeader from './IPAddressesHeader';
import AddIPAddressForm from './AddIPAddressForm';
import { toast } from 'sonner';

interface IPAddress {
  id: number;
  userId: number;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}

const IPAddressesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIPAddress, setEditingIPAddress] = useState<IPAddress | null>(null);
  const [ipAddresses, setIPAddresses] = useState<IPAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIPAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/settings/ip-addresses');
      if (!response.ok) {
        throw new Error('Failed to fetch IP addresses');
      }
      const data = await response.json();
      setIPAddresses(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch IP addresses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIPAddresses();
  }, []);

  const handleAddClick = () => {
    setEditingIPAddress(null);
    setShowAddForm(true);
  };

  const handleEditClick = (ipAddress: IPAddress) => {
    setEditingIPAddress(ipAddress);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/settings/ip-addresses?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete IP address');
      }
      
      await fetchIPAddresses();
      toast.success('IP address deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete IP address');
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete all IP addresses? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/v1/settings/ip-addresses/all', {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete all IP addresses');
        }
        
        setIPAddresses([]);
        toast.success('All IP addresses deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete all IP addresses');
      }
    }
  };

  const handleSearch = async (keyword: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/settings/ip-addresses?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error('Failed to search IP addresses');
      }
      const data = await response.json();
      setIPAddresses(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to search IP addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (ipAddress: IPAddress) => {
    try {
      const url = '/api/v1/settings/ip-addresses';
      const method = editingIPAddress ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ipAddress),
      });

      if (!response.ok) {
        throw new Error(editingIPAddress 
          ? 'Failed to update IP address' 
          : 'Failed to create IP address');
      }

      toast.success(editingIPAddress 
        ? 'IP address updated successfully' 
        : 'IP address created successfully');
      
      await fetchIPAddresses();
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingIPAddress(null);
  };

  return (
    <div>
      {showAddForm ? (
        <AddIPAddressForm
          onSave={handleSave}
          onCancel={handleCancel}
          ipAddress={editingIPAddress}
        />
      ) : (
        <IPAddressesHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onSearch={handleSearch}
          ipAddresses={ipAddresses}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default IPAddressesView;