"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
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
}

const WebhooksHeader: React.FC<WebhooksHeaderProps> = ({ onAddClick, onEditClick }) => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    event: null,
    targetUrl: null,
    createdBy: null,
    company: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/webhooks/all`);
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setWebhooks(data);
      setTotalPages(Math.ceil(data.length / 5) || 1);
    } catch (err: any) {
      console.error('Fetch All Error:', err);
      toast.error(`Failed to fetch webhooks: ${err.message || 'Unknown error'}`);
      setWebhooks([]);
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
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/webhooks/search?keyword=${encodeURIComponent(searchQuery)}&page=${currentPage - 1}&size=10`
            );
            const data = 'content' in response.data ? response.data.content : [];
            setWebhooks(data);
            setTotalPages(response.data.totalPages || 1);
          } catch (err: any) {
            console.error('Search Error:', err);
            toast.error(`Failed to search webhooks: ${err.message || 'Unknown error'}`);
            setWebhooks([]);
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
  }, [searchQuery, currentPage]);

  const handleSort = (column: keyof Webhook) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...webhooks].sort((a, b) => {
      const aValue = a[column] || '';
      const bValue = b[column] || '';
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setWebhooks(sortedData);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/webhooks/delete/${id}`);
      const updated = webhooks.filter((item) => item.id !== id);
      setWebhooks(updated);
      setTotalPages(Math.ceil(updated.length / 5) || 1);
      if ((currentPage - 1) * 5 >= updated.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      toast.success('Webhook deleted successfully!');
    } catch (err: any) {
      toast.error(`Failed to delete webhook: ${err.message || 'Unknown error'}`);
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
  const currentData = webhooks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Webhooks</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
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
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 mr-4">No webhooks found.</p>
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
                {['event', 'targetUrl', 'createdBy', 'company'].map((col) => (
                  <TableHead key={col} className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(col as keyof Webhook)}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>{col.replace(/([A-Z])/g, ' $1')}</span>
                      {getSortIcon(col)}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-1/5 text-left truncate">{item.event}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-left truncate">{item.targetUrl}</TableCell>
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
        </>
      )}
    </div>
  );
};

export default WebhooksHeader;
