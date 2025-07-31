"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';

interface GlobalWebhook {
  id: number;
  userId: number;
  event: string;
  dataTypeEnabled: boolean;
  destination: 'TARGET_URL' | 'EMAIL' | 'BOTH';
  email: string;
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface GlobalWebhooksHeaderProps {
  onAddClick: () => void;
  onEditClick: (webhook: GlobalWebhook) => void;
}

const GlobalWebhooksHeader: React.FC<GlobalWebhooksHeaderProps> = ({
  onAddClick,
  onEditClick,
}) => {
  const [globalWebhooks, setGlobalWebhooks] = useState<GlobalWebhook[]>([]);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    event: null,
    email: null,
    targetUrl: null,
    createdBy: null,
    company: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all global webhooks on mount
  useEffect(() => {
    const fetchGlobalWebhooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<GlobalWebhook[]>('https://zotly.onrender.com/api/v1/settings/global-webhooks');
        setGlobalWebhooks(response.data);
      } catch (err) {
        toast.error('Failed to fetch global webhooks. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalWebhooks();
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get<GlobalWebhook[]>(
        `https://zotly.onrender.com/api/v1/settings/global-webhooks/search?keyword=${encodeURIComponent(query)}&page=${currentPage - 1}&size=10`
      );
      setGlobalWebhooks(response.data);
    } catch (err) {
      toast.error('Failed to search global webhooks. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        const fetchAll = async () => {
          try {
            setIsLoading(true);
            const response = await axios.get<GlobalWebhook[]>('https://zotly.onrender.com/api/v1/settings/global-webhooks');
            setGlobalWebhooks(response.data);
          } catch (err) {
            toast.error('Failed to fetch global webhooks. Please try again.', {
              position: 'top-right',
              autoClose: 3000,
            });
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        };
        fetchAll();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentPage]);

  const handleSort = (column: keyof GlobalWebhook) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...globalWebhooks].sort((a, b) => {
      const aValue = a[column] || '';
      const bValue = b[column] || '';
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setGlobalWebhooks(sortedData);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://zotly.onrender.com/api/v1/settings/global-webhooks/${id}`);
      setGlobalWebhooks((prev) => {
        const newData = prev.filter((item) => item.id !== id);
        if (newData.length <= (currentPage - 1) * 5) {
          setCurrentPage((prev) => Math.max(1, prev - 1));
        }
        return newData;
      });
      toast.success('Global webhook deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error('Failed to delete global webhook. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
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
  const currentData = globalWebhooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(globalWebhooks.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Global Webhooks</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search global webhooks"
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
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : globalWebhooks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Global Webhook
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('event')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Event</span>
                    {getSortIcon('event')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Email</span>
                    {getSortIcon('email')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('targetUrl')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Target URL</span>
                    {getSortIcon('targetUrl')}
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
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-1/5 text-left text-ellipsis overflow-hidden max-w-0">{item.event}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-left text-ellipsis overflow-hidden max-w-0">{item.email}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-left text-ellipsis overflow-hidden max-w-0">{item.targetUrl}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 truncate text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>{item.createdBy}</span>
                      <span className="text-sm text-gray-500">{item.createdAt}</span>
                    </div>
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

export default GlobalWebhooksHeader;