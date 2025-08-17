'use client'

import React, { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'sonner';

interface RolePermission {
  id: number;
  userId: number;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

interface RolePermissionHeaderProps {
  onAddClick: () => void;
  onEditClick: (rolePermission: RolePermission) => void;
  onDelete: (id: number) => void;
  onDeleteAll: () => void;
  onSearch: (keyword: string) => void;
  rolePermissions: RolePermission[];
  isLoading: boolean;
}

const RolePermissionHeader: React.FC<RolePermissionHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  onDeleteAll,
  onSearch,
  rolePermissions,
  isLoading,
}) => {
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RolePermission;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedRolePermissions = useMemo(() => {
    const sortableItems = [...rolePermissions];
    if (sortConfig) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [rolePermissions, sortConfig]);

  const filteredRolePermissions = sortedRolePermissions.filter(rolePermission =>
    rolePermission.userRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedRolePermissions = filteredRolePermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRolePermissions.length / itemsPerPage);

  const requestSort = (key: keyof RolePermission) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof RolePermission) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={`p-8 rounded-xl shadow-lg border ${
      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-2xl font-semibold text-gray-800 dark:text-white${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Role Permissions
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              type="text"
              placeholder="Search role permissions"
              className={`w-full pl-10 py-2 focus:outline-none rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'border-gray-300 text-black'
              }`}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
    <Button 
  onClick={onAddClick} 
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
>
  <Plus className="h-4 w-4" />
  <span>Add</span>
</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className={`h-12 w-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      ) : rolePermissions.length === 0 ? (
        <div className={`flex justify-center items-center h-64 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
        }`}>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role Permission
          </Button>
        </div>
      ) : (
        <>
          <Table className={`border w-full ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <TableHeader className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
              <TableRow>
                <TableHead className={`px-4 py-4 hover:bg-opacity-50 w-1/5 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('userRole')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span className={theme === 'dark' ? 'text-white' : ''}>User Role</span>
                    {getSortIcon('userRole')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 hover:bg-opacity-50 w-1/5 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100'
                }`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRolePermissions.map((item) => (
                <TableRow key={item.id} className={theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                  <TableCell className={`px-4 py-3 w-1/5 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.userRole}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditClick(item)}
                      >
                        <Pencil className={`h-4 w-4 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                        }`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className={`h-4 w-4 ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-500'
                        }`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className="mx-1"
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RolePermissionHeader;