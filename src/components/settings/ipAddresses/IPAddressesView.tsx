"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import IPAddressesHeader from './IPAddressesHeader';
import AddIPAddressForm from './AddIPAddressForm';

// TypeScript interface for the IP address
interface IPAddress {
  id: number;
  userId: number;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}

const IPAddressesView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [ipAddresses, setIPAddresses] = useState<IPAddress[]>([]);
  const [selectedIPAddress, setSelectedIPAddress] = useState<IPAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = 'https://zotly.onrender.com/api/v1/settings/ip-addresses';

  // Fetch all IP addresses
  const fetchIPAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<IPAddress[]>(`${BASE_URL}/all`);
      setIPAddresses(response.data || []);
      toast.success('IP addresses fetched successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch IP addresses');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIPAddresses();
  }, []);

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setSelectedIPAddress(null);
  };

  const handleEditClick = (ipAddress: IPAddress) => {
    setSelectedIPAddress(ipAddress);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedIPAddress(null);
  };

  const handleSave = async (ipAddress: Omit<IPAddress, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post<IPAddress>(`${BASE_URL}/save`, {
        ...ipAddress,
        userId: ipAddress.userId || 1, // Default userId
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      await fetchIPAddresses();
      setShowAddForm(false);
      toast.success('IP address added successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save IP address');
      console.error(err);
    }
  };

  const handleUpdate = async (ipAddress: IPAddress) => {
    try {
      const response = await axios.put<IPAddress>(`${BASE_URL}/update`, {
        ...ipAddress,
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      await fetchIPAddresses();
      setShowEditForm(false);
      setSelectedIPAddress(null);
      toast.success('IP address updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update IP address');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      await fetchIPAddresses();
      toast.success('IP address deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete IP address');
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete/all`);
      setIPAddresses([]);
      toast.success('All IP addresses deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete all IP addresses');
      console.error(err);
    }
  };

  const handleSearch = async (keyword: string, page: number = 0, size: number = 10) => {
    try {
      setIsLoading(true);
      const response = await axios.get<IPAddress[]>(
        `${BASE_URL}/search`,
        {
          params: { keyword, page, size },
        }
      );
      setIPAddresses(response.data || []);
      toast.success(`Found ${response.data.length} IP address(es)`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to search IP addresses');
      console.error(err);
      setIPAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showAddForm || showEditForm ? (
        <AddIPAddressForm
          onSave={showEditForm ? handleUpdate : handleSave}
          onCancel={handleCancel}
          ipAddress={showEditForm ? selectedIPAddress : null}
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