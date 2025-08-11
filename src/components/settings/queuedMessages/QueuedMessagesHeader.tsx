"use client";

import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';

interface QueuedMessage {
  id: number;
  userId: number;
  message: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface QueuedMessagesHeaderProps {
  onAddClick: () => void;
  onEditClick: (message: QueuedMessage) => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
  queuedMessages: QueuedMessage[];
  isLoading: boolean;
  setError: (error: string | null) => void;
}

const QueuedMessagesHeader: React.FC<QueuedMessagesHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  onClearAll,
  queuedMessages = [],
  isLoading,
  setError,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof QueuedMessage; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE_URL = '/api/v1/settings/queued-messages';

  const sortedMessages = useMemo(() => {
    const sortableItems = [...queuedMessages];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
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
  }, [queuedMessages, sortConfig]);

  const filteredMessages = sortedMessages.filter((message) =>
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const requestSort = (key: keyof QueuedMessage) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof QueuedMessage) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-2" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-2" />
    );
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearch = async () => {
    try {
      setError(null);
      const response = await axios.get<QueuedMessage[]>(
        `${API_BASE_URL}?keyword=${encodeURIComponent(searchTerm)}&page=${currentPage - 1}&size=${itemsPerPage}`
      );
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Queued messages API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to search queued messages';
      console.error('Search error:', errorMessage, err.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      return queuedMessages;
    }
  };

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch().then((data) => {
          queuedMessages.splice(0, queuedMessages.length, ...data);
        });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Queued Messages</h2>
        <div className="flex gap-6">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search queued messages..."
              className="pl-10 py-2 w-full text-black focus:outline-none rounded-md border border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-3 rounded-lg"
            onClick={onAddClick}
          >
            <Plus className="h-5 w-5" />
            Add 
          </Button>
          <Button
            className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
            onClick={onClearAll}
            disabled={queuedMessages.length === 0}
          >
            <Trash2 className="h-5 w-5" />
            Clear All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first queued message
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                {['message', 'createdBy', 'company'].map((key) => (
                  <TableHead key={key} className="px-4 py-4 hover:bg-gray-100 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(key as keyof QueuedMessage)}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {getSortIcon(key as keyof QueuedMessage)}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className="px-4 py-4 hover:bg-gray-100 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMessages.map((message) => (
                <TableRow key={message.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 truncate text-center">{message.message}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{message.createdBy}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{message.company}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => onEditClick(message)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => onDelete(message.id)}
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

export default QueuedMessagesHeader;