"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import RolePermissionHeader from './RolePermissionHeader';
import AddRolePermissionForm from './AddRolePermissionForm';

// TypeScript interface for the role permission
interface RolePermission {
  id: number;
  userId: number;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

const RolePermissionsView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRolePermission, setSelectedRolePermission] = useState<RolePermission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = 'https://zotly.onrender.com/api/v1/settings/role-permissions';

  // Fetch all role permissions
  const fetchRolePermissions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<RolePermission[]>(`${BASE_URL}/all`);
      setRolePermissions(response.data || []);
      toast.success('Role permissions fetched successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch role permissions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRolePermissions();
  }, []);

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setSelectedRolePermission(null);
  };

  const handleEditClick = (rolePermission: RolePermission) => {
    setSelectedRolePermission(rolePermission);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedRolePermission(null);
  };

  const handleSave = async (rolePermission: Omit<RolePermission, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post<RolePermission>(`${BASE_URL}/save`, {
        ...rolePermission,
        userId: rolePermission.userId || 1, // Default userId
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      await fetchRolePermissions();
      setShowAddForm(false);
      toast.success('Role permission added successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save role permission');
      console.error(err);
    }
  };

  const handleUpdate = async (rolePermission: RolePermission) => {
    try {
      const response = await axios.put<RolePermission>(`${BASE_URL}/update`, {
        ...rolePermission,
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      await fetchRolePermissions();
      setShowEditForm(false);
      setSelectedRolePermission(null);
      toast.success('Role permission updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role permission');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      await fetchRolePermissions();
      toast.success('Role permission deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete role permission');
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete/all`);
      setRolePermissions([]);
      toast.success('All role permissions deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete all role permissions');
      console.error(err);
    }
  };

  const handleSearch = async (keyword: string, page: number = 0, size: number = 10) => {
    try {
      setIsLoading(true);
      const response = await axios.get<RolePermission[]>(
        `${BASE_URL}/search`,
        {
          params: { keyword, page, size },
        }
      );
      setRolePermissions(response.data || []);
      toast.success(`Found ${response.data.length} role permission(s)`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to search role permissions');
      console.error(err);
      setRolePermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showAddForm || showEditForm ? (
        <AddRolePermissionForm
          onSave={showEditForm ? handleUpdate : handleSave}
          onCancel={handleCancel}
          rolePermission={showEditForm ? selectedRolePermission : null}
        />
      ) : (
        <RolePermissionHeader
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          onSearch={handleSearch}
          rolePermissions={rolePermissions}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default RolePermissionsView;