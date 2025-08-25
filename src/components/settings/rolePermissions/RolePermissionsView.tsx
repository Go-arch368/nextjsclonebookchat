'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import RolePermissionHeader from './RolePermissionHeader';
import AddRolePermissionForm from './AddRolePermissionForm';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/useUserStore';
interface RolePermission {
  id: number;
  userId: number;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

const RolePermissionsView: React.FC = () => {
  const {user} = useUserStore()
  const { theme } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRolePermission, setEditingRolePermission] = useState<RolePermission | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRolePermissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/settings/role-permissions');
      if (!response.ok) throw new Error('Failed to fetch role permissions');
      setRolePermissions(await response.json());
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch role permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchRolePermissions(); }, []);

  const handleSave = async (rolePermission: RolePermission) => {
    try {

    const payload = {
      ...rolePermission,userId:user?.id ?? 0
    }

      const url = '/api/v1/settings/role-permissions';
      const method = editingRolePermission ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(
        editingRolePermission 
          ? 'Failed to update role permission' 
          : 'Failed to create role permission'
      );

      toast.success(
        editingRolePermission 
          ? 'Role permission updated successfully' 
          : 'Role permission created successfully'
      );
      
      await fetchRolePermissions();
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      {showAddForm ? (
        <AddRolePermissionForm
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            setEditingRolePermission(null);
          }}
          rolePermission={editingRolePermission}
        />
      ) : (
        <RolePermissionHeader
          onAddClick={() => {
            setEditingRolePermission(null);
            setShowAddForm(true);
          }}
          onEditClick={(role) => {
            setEditingRolePermission(role);
            setShowAddForm(true);
          }}
          onDelete={async (id) => {
            try {
              const response = await fetch(`/api/v1/settings/role-permissions?id=${id}`, {
                method: 'DELETE',
              });
              if (!response.ok) throw new Error('Failed to delete role permission');
              await fetchRolePermissions();
              toast.success('Role permission deleted successfully');
            } catch (error: any) {
              toast.error(error.message || 'Failed to delete role permission');
            }
          }}
          onDeleteAll={async () => {
            if (confirm('Are you sure you want to delete all role permissions?')) {
              try {
                const response = await fetch('/api/v1/settings/role-permissions/all', {
                  method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete all role permissions');
                setRolePermissions([]);
                toast.success('All role permissions deleted successfully');
              } catch (error: any) {
                toast.error(error.message || 'Failed to delete all role permissions');
              }
            }
          }}
          onSearch={async (keyword) => {
            try {
              setIsLoading(true);
              const response = await fetch(
                `/api/v1/settings/role-permissions?keyword=${encodeURIComponent(keyword)}`
              );
              if (!response.ok) throw new Error('Failed to search role permissions');
              setRolePermissions(await response.json());
            } catch (error: any) {
              toast.error(error.message || 'Failed to search role permissions');
            } finally {
              setIsLoading(false);
            }
          }}
          rolePermissions={rolePermissions}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default RolePermissionsView;