"use client";

import React, { useState, useEffect } from 'react';
import RolePermissionHeader from './RolePermissionHeader';
import AddRolePermissionForm from './AddRolePermissionForm';
import { toast } from 'sonner';

interface RolePermission {
  id: number;
  userId: number;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

const RolePermissionsView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRolePermission, setEditingRolePermission] = useState<RolePermission | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRolePermissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/settings/role-permissions');
      if (!response.ok) {
        throw new Error('Failed to fetch role permissions');
      }
      const data = await response.json();
      setRolePermissions(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch role permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRolePermissions();
  }, []);

  const handleAddClick = () => {
    setEditingRolePermission(null);
    setShowAddForm(true);
  };

  const handleEditClick = (rolePermission: RolePermission) => {
    setEditingRolePermission(rolePermission);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/settings/role-permissions?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete role permission');
      }
      
      await fetchRolePermissions();
      toast.success('Role permission deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete role permission');
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete all role permissions? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/v1/settings/role-permissions/all', {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete all role permissions');
        }
        
        setRolePermissions([]);
        toast.success('All role permissions deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete all role permissions');
      }
    }
  };

  const handleSearch = async (keyword: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/settings/role-permissions?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error('Failed to search role permissions');
      }
      const data = await response.json();
      setRolePermissions(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to search role permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (rolePermission: RolePermission) => {
    try {
      const url = '/api/v1/settings/role-permissions';
      const method = editingRolePermission ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rolePermission),
      });

      if (!response.ok) {
        throw new Error(editingRolePermission 
          ? 'Failed to update role permission' 
          : 'Failed to create role permission');
      }

      toast.success(editingRolePermission 
        ? 'Role permission updated successfully' 
        : 'Role permission created successfully');
      
      await fetchRolePermissions();
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingRolePermission(null);
  };

  return (
    <div>
      {showAddForm ? (
        <AddRolePermissionForm
          onSave={handleSave}
          onCancel={handleCancel}
          rolePermission={editingRolePermission}
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