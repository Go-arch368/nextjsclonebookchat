
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';
import { SmartResponse } from './SmartResponsesView';

interface SmartResponsesHeaderProps {
  onAddClick: () => void;
  onEditClick: (response: SmartResponse) => void;
  onDelete: (id: number) => void;
  smartResponses: SmartResponse[];
  setSmartResponses: React.Dispatch<React.SetStateAction<SmartResponse[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: (error: string | null) => void;
}

const SmartResponsesHeader: React.FC<SmartResponsesHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  smartResponses,
  setSmartResponses,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof SmartResponse; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 10;

  const API_BASE_URL = '/api/v1/settings/smart-responses';

  const sortedResponses = useMemo(() => {
    const sortableItems = [...smartResponses];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const getSortValue = (item: SmartResponse, key: keyof SmartResponse) => {
          const value = item[key];
          if (Array.isArray(value)) {
            return value.join(', ');
          }
          return String(value ?? '');
        };

        const aValue = getSortValue(a, sortConfig.key);
        const bValue = getSortValue(b, sortConfig.key);
        
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
  }, [smartResponses, sortConfig]);

  const filteredResponses = sortedResponses.filter(
    (response) =>
      response.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.shortcuts.some((shortcut) => shortcut.toLowerCase().includes(searchQuery.toLowerCase())) ||
      response.websites.some((website) => website.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResponses = filteredResponses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage) || 1;

  const fetchSmartResponses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<SmartResponse[]>(`${API_BASE_URL}?action=list`);
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      setSmartResponses(response.data);
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Smart responses API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to fetch smart responses';
      console.error('Fetch All Error:', err);
      setError(message);
      setSmartResponses([]);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        const handleSearch = async () => {
          try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get<SmartResponse[]>(
              `${API_BASE_URL}?action=search&keyword=${encodeURIComponent(searchQuery)}`
            );
            if (!Array.isArray(response.data)) {
              throw new Error('Invalid response format: Expected an array');
            }
            setSmartResponses(response.data);
          } catch (err: any) {
            const message =
              err.response?.status === 404
                ? 'Smart responses API route not found. Please check the server configuration.'
                : err.response?.data?.message || err.message || 'Failed to search smart responses';
            console.error('Search Error:', err);
            setError(message);
            setSmartResponses([]);
            toast.error(message, {
              position: 'top-right',
              autoClose: 3000,
            });
          } finally {
            setIsLoading(false);
          }
        };
        handleSearch();
      } else {
        fetchSmartResponses();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSort = (key: keyof SmartResponse) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.delete(`${API_BASE_URL}?action=clear`, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSmartResponses([]);
      setCurrentPage(1);
      toast.success('All smart responses cleared successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Smart responses API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to clear smart responses';
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error clearing smart responses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast.warn('No responses selected for deletion.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all(
        selectedRows.map((id) =>
          axios.delete(`${API_BASE_URL}?id=${id}`, {
            headers: { 'Content-Type': 'application/json' },
          })
        )
      );
      const updated = smartResponses.filter((r) => !selectedRows.includes(r.id));
      setSmartResponses(updated);
      setSelectedRows([]);
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      toast.success('Selected smart responses deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Smart responses API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete selected smart responses';
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Delete selected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowCheckboxChange = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-2" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-2" />
    );
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Smart Responses</h2>
        <div className="flex gap-6">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search responses..."
              className="pl-10 py-2 w-full text-black focus:outline-none rounded-md border border-gray-300"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-3 rounded-lg"
            onClick={onAddClick}
          >
            <Plus className="h-5 w-5" />
            Add New
          </Button>
          <Button
            className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
            onClick={handleClearAll}
            disabled={smartResponses.length === 0}
          >
            <Trash2 className="h-5 w-5" />
            Clear All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2 mt-8">
          {[...Array(itemsPerPage)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : smartResponses.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first smart response
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full mt-8">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-[5%] text-center">
                  <Checkbox
                    checked={selectedRows.length === currentResponses.length && currentResponses.length > 0}
                    onCheckedChange={() =>
                      setSelectedRows(
                        selectedRows.length === currentResponses.length
                          ? []
                          : currentResponses.map((r) => r.id)
                      )
                    }
                    className="h-4 w-4 text-blue-500"
                  />
                </TableHead>
                {['shortcuts', 'response', 'createdBy', 'company', 'websites'].map((col) => (
                  <TableHead key={col} className="px-4 py-4 hover:bg-gray-100 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(col as keyof SmartResponse)}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      {col === 'createdBy' ? 'Created By' : col.charAt(0).toUpperCase() + col.slice(1)}
                      {getSortIcon(col)}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className="px-4 py-4 hover:bg-gray-100 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResponses.map((response) => (
                <TableRow key={response.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 text-center">
                    <Checkbox
                      checked={selectedRows.includes(response.id)}
                      onCheckedChange={() => handleRowCheckboxChange(response.id)}
                      className="h-4 w-4 text-blue-500"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {response.shortcuts.map((shortcut) => (
                        <span key={shortcut} className="bg-gray-100 px-2 py-1 rounded text-xs">
                          #{shortcut}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 truncate text-center max-w-xs">{response.response}</TableCell>
                  <TableCell className="px-4 py-3 text-center">{response.createdBy}</TableCell>
                  <TableCell className="px-4 py-3 text-center">{response.company}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{response.websites.join(', ')}</TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => onEditClick(response)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => onDelete(response.id)}
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
          {selectedRows.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button
                className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-5 w-5" />
                Delete Selected
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SmartResponsesHeader;
