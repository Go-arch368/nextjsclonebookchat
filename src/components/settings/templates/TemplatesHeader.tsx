"use client";

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';

interface Template {
  id: number;
  userId: number;
  businessCategory: string;
  businessSubcategory: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplatesHeaderProps {
  onAddClick: () => void;
  onEditClick: (template: Template) => void;
  onDelete: (id: number) => void;
  templates: Template[];
  isLoading: boolean;
}

const TemplatesHeader: React.FC<TemplatesHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  templates,
  isLoading,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Template;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

const sortedTemplates = React.useMemo(() => {
  const sortableItems = [...templates];
  if (sortConfig !== null) {
    sortableItems.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  return sortableItems;
}, [templates, sortConfig]);

  const filteredTemplates = sortedTemplates.filter(template =>
    template.businessCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.businessSubcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

  const requestSort = (key: keyof Template) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Template) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete all templates? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/v1/settings/templates/all', {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete all templates');
        }
        
        toast.success('All templates deleted successfully');
        window.location.reload();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete all templates');
      }
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Templates</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search templates"
              className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-3 rounded-lg"
            onClick={onAddClick}
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </Button>
          <Button
            className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
            onClick={handleDeleteAll}
            disabled={templates.length === 0}
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete All</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Template
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-2/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('businessCategory')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Business Category</span>
                    {getSortIcon('businessCategory')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-2/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('businessSubcategory')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Business Subcategory</span>
                    {getSortIcon('businessSubcategory')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('createdBy')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Created By</span>
                    {getSortIcon('createdBy')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTemplates.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-2/5 text-left text-ellipsis overflow-hidden max-w-0">
                    {item.businessCategory}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-2/5 text-left text-ellipsis overflow-hidden max-w-0">
                    {item.businessSubcategory || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 truncate text-center">
                    {item.createdBy}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 truncate text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => onEditClick(item)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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

export default TemplatesHeader;