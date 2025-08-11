
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

interface Webhook {
  id: number;
  userId: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface WebhooksHeaderProps {
  onAddClick: () => void;
  onEditClick: (webhook: Webhook) => void;
  webhooks: Webhook[];
  setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: (error: string | null) => void;
}

const WebhooksHeader: React.FC<WebhooksHeaderProps> = ({
  onAddClick,
  onEditClick,
  webhooks,
  setWebhooks,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Webhook; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 5;

  const API_BASE_URL = '/api/v1/settings/webhooks';

  const sortedWebhooks = useMemo(() => {
    if (!sortConfig) return webhooks;
    const sortableItems = [...webhooks];
    sortableItems.sort((a, b) => {
      const key = sortConfig.key;
      let aValue: string;
      let bValue: string;

      if (key === 'dataTypes') {
        aValue = a.dataTypes.join(', ');
        bValue = b.dataTypes.join(', ');
      } else {
        aValue = String(a[key] ?? '');
        bValue = String(b[key] ?? '');
      }

      const comparison = aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    return sortableItems;
  }, [webhooks, sortConfig]);

  const filteredWebhooks = sortedWebhooks.filter(
    (webhook) =>
      webhook.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.dataTypes.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWebhooks = filteredWebhooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWebhooks.length / itemsPerPage) || 1;

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<Webhook[]>(`${API_BASE_URL}?action=list`);
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      setWebhooks(response.data);
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Webhooks API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to fetch webhooks';
      console.error('Fetch Error:', err);
      setError(message);
      setWebhooks([]);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        const handleSearch = async () => {
          try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get<Webhook[]>(
              `${API_BASE_URL}?action=search&keyword=${encodeURIComponent(searchQuery)}`
            );
            if (!Array.isArray(response.data)) {
              throw new Error('Invalid response format: Expected an array');
            }
            setWebhooks(response.data);
          } catch (err: any) {
            const message =
              err.response?.status === 404
                ? 'Webhooks API route not found. Please check the server configuration.'
                : err.response?.data?.message || err.message || 'Failed to search webhooks';
            console.error('Search Error:', err);
            setError(message);
            setWebhooks([]);
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
        fetchWebhooks();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSort = (key: keyof Webhook) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.delete(`${API_BASE_URL}?id=${id}`);
      const updated = webhooks.filter((item) => item.id !== id);
      setWebhooks(updated);
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      toast.success('Webhook deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Webhooks API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete webhook';
      console.error('Delete Error:', err);
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast.warn('No webhooks selected for deletion.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all(
        selectedRows.map((id) => axios.delete(`${API_BASE_URL}?id=${id}`))
      );
      const updated = webhooks.filter((w) => !selectedRows.includes(w.id));
      setWebhooks(updated);
      setSelectedRows([]);
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      toast.success('Selected webhooks deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Webhooks API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete selected webhooks';
      console.error('Delete Selected Error:', err);
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.delete(`${API_BASE_URL}?action=clear`);
      setWebhooks([]);
      setCurrentPage(1);
      toast.success('All webhooks cleared successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Webhooks API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to clear webhooks';
      console.error('Clear Error:', err);
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Webhooks</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search webhooks"
              className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
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
            <span>Add</span>
          </Button>
          <Button
            className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
            onClick={handleClearAll}
            disabled={webhooks.length === 0}
          >
            <Trash2 className="h-5 w-5" />
            Clear All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(itemsPerPage)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Webhook
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-[5%] text-center">
                  <Checkbox
                    checked={selectedRows.length === currentWebhooks.length && currentWebhooks.length > 0}
                    onCheckedChange={() =>
                      setSelectedRows(
                        selectedRows.length === currentWebhooks.length
                          ? []
                          : currentWebhooks.map((w) => w.id)
                      )
                    }
                    className="h-4 w-4 text-blue-500"
                  />
                </TableHead>
                {['event', 'targetUrl', 'dataTypes', 'createdBy', 'company'].map((col) => (
                  <TableHead key={col} className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(col as keyof Webhook)}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>{col.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                      {getSortIcon(col)}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentWebhooks.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 text-center">
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={() => handleRowCheckboxChange(item.id)}
                      className="h-4 w-4 text-blue-500"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-left truncate">{item.event}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-left truncate">{item.targetUrl}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-left truncate">{item.dataTypes.join(', ')}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>{item.createdBy}</span>
                      <span className="text-sm text-gray-500">{item.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-center">{item.company}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button variant="ghost" className="bg-white p-1 rounded" onClick={() => onEditClick(item)}>
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" className="bg-white p-1 rounded" onClick={() => handleDelete(item.id)}>
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

export default WebhooksHeader
