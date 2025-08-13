"use client";

import React, { useState, useEffect } from 'react';
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
  const [webhooks, setWebhooks] = useState<GlobalWebhook[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof GlobalWebhook;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        setIsLoading(true);
        const url = searchQuery 
          ? `/api/v1/settings/global-webhooks/search?keyword=${encodeURIComponent(searchQuery)}&page=${currentPage - 1}&size=${itemsPerPage}`
          : `/api/v1/settings/global-webhooks?page=${currentPage - 1}&size=${itemsPerPage}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch webhooks');
        const data = await response.json();
        setWebhooks(data);
      } catch (error) {
        toast.error('Failed to fetch global webhooks');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebhooks();
  }, [searchQuery, currentPage]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/settings/global-webhooks?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete webhook');
      
      setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
      toast.success('Webhook deleted successfully');
    } catch (error) {
      toast.error('Failed to delete webhook');
      console.error(error);
    }
  };

const sortedWebhooks = React.useMemo(() => {
  const sortableItems = [...webhooks];
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
}, [webhooks, sortConfig]);

  const filteredWebhooks = sortedWebhooks.filter(webhook =>
    webhook.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedWebhooks = filteredWebhooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredWebhooks.length / itemsPerPage);

  const requestSort = (key: keyof GlobalWebhook) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof GlobalWebhook) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const formatDestination = (destination: string) => {
    return destination.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

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
      ) : webhooks.length === 0 ? (
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
                    onClick={() => requestSort('event')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Event</span>
                    {getSortIcon('event')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <span>Data Type</span>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('destination')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Destination</span>
                    {getSortIcon('destination')}
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
              {paginatedWebhooks.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-1/5 text-center">
                    {item.event.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-center">
                    {item.dataTypeEnabled ? 'Enabled' : 'Disabled'}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-center">
                    {formatDestination(item.destination)}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-center">
                    {item.createdBy}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-center">
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

export default GlobalWebhooksHeader;