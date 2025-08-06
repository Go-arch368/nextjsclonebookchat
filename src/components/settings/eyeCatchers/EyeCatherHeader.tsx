"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';

interface EyeCatcher {
  id: number;
  userId: number;
  title: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  imageUrl: string | null;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface EyeCatcherHeaderProps {
  onAddClick: () => void;
  onEditClick: (eyeCatcher: EyeCatcher) => void;
  eyeCatchers: EyeCatcher[];
  onRefresh: () => void;
  isLoading: boolean;
  setError: (error: string | null) => void;
}

const EyeCatcherHeader: React.FC<EyeCatcherHeaderProps> = ({
  onAddClick,
  onEditClick,
  eyeCatchers,
  onRefresh,
  isLoading,
  setError,
}) => {
  const [tableData, setTableData] = useState<EyeCatcher[]>(eyeCatchers);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    title: null,
    createdBy: null,
    company: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filteredData = eyeCatchers.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTableData(filteredData);
  }, [eyeCatchers, searchQuery]);

  const handleSort = (column: keyof EyeCatcher) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...tableData].sort((a, b) => {
      const aValue = a[column] || '';
      const bValue = b[column] || '';
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setTableData(sortedData);
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/eye-catchers/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete eye catcher: ${response.status}`);
      }
      // Update the tableData state locally by filtering out the deleted item
      setTableData((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      setError(error.message || 'Failed to delete eye catcher');
      console.error('Error deleting eye catcher:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/eye-catchers/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to clear eye catchers: ${response.status}`);
      }
      setTableData([]);
    } catch (error: any) {
      setError(error.message || 'Failed to clear eye catchers');
      console.error('Error clearing eye catchers:', error);
    }
  };

  const getSortIcon = (column: string) => {
    const direction = sortDirection[column];
    if (direction === 'asc') return <ArrowUp className="h-4 w-4 ml-2" />;
    if (direction === 'desc') return <ArrowDown className="h-4 w-4 ml-2" />;
    return null;
  };

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Eye Catcher</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by title"
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
            onClick={handleClearAll}
          >
            <Trash2 className="h-5 w-5" />
            <span>Clear All</span>
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : tableData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Eye Catcher
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
                    onClick={() => handleSort('title')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Title</span>
                    {getSortIcon('title')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('createdBy')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Created By</span>
                    {getSortIcon('createdBy')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('company')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-2/5 truncate text-center">{item.title}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 truncate text-center">{item.createdBy}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 truncate text-center">{item.company}</TableCell>
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
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => paginate(page)}
                className="mx-1"
              >
                {page}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EyeCatcherHeader;