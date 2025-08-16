"use client";

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { useTheme } from 'next-themes';

interface Webhook {
  id?: number;
  userId?: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt?: string;
  updatedAt?: string;
}

interface WebhooksHeaderProps {
  onAddClick: () => void;
  onEditClick: (webhook: Webhook) => void;
  onDelete: (id: number) => void;
  webhooks: Webhook[];
  isLoading: boolean;
  error: string | null;
}

const WebhooksHeader: React.FC<WebhooksHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  webhooks,
  isLoading,
  error,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Webhook;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { theme } = useTheme();
  const itemsPerPage = 5;

  const sortedWebhooks = React.useMemo(() => {
    const sortableItems = [...webhooks];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = Array.isArray(a[sortConfig.key])
          ? JSON.stringify(a[sortConfig.key])
          : a[sortConfig.key] || '';
        const bValue = Array.isArray(b[sortConfig.key])
          ? JSON.stringify(b[sortConfig.key])
          : b[sortConfig.key] || '';
        
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
    webhook.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedWebhooks = filteredWebhooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredWebhooks.length / itemsPerPage);

  const requestSort = (key: keyof Webhook) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Webhook) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  return (
    <div className={`p-8 rounded-xl shadow-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      {error && (
        <div className={`mb-4 p-4 rounded ${theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Webhooks</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-[350px]">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <Input
              placeholder="Search webhooks..."
              className={`pl-10 w-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button 
            onClick={onAddClick} 
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(itemsPerPage)].map((_, i) => (
            <Skeleton key={i} className={`h-12 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <div className={`flex flex-col justify-center items-center h-64 gap-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
          <p>No webhooks found</p>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first webhook
          </Button>
        </div>
      ) : (
        <>
          <Table className={`border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} w-full`}>
            <TableHeader className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
              <TableRow>
                {['event', 'targetUrl', 'createdBy', 'company'].map((col) => (
                  <TableHead 
                    key={col} 
                    className={`px-4 py-4 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(col as keyof Webhook)}
                      className={`p-0 w-full flex items-center justify-start ${theme === 'dark' ? 'text-white' : ''}`}
                    >
                      {col === 'createdBy' ? 'Created By' : col.charAt(0).toUpperCase() + col.slice(1)}
                      {getSortIcon(col as keyof Webhook)}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className={`px-4 py-4 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} text-right`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedWebhooks.map((webhook) => (
                <TableRow 
                  key={webhook.id} 
                  className={theme === 'dark' ? 'hover:bg-gray-800 border-gray-700' : 'hover:bg-gray-100'}
                >
                  <TableCell className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                    {webhook.event}
                  </TableCell>
                  <TableCell className={`px-4 py-3 truncate max-w-xs ${theme === 'dark' ? 'text-white' : ''}`}>
                    {webhook.targetUrl}
                  </TableCell>
                  <TableCell className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                    {webhook.createdBy}
                  </TableCell>
                  <TableCell className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                    {webhook.company}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditClick(webhook)}
                        aria-label="Edit webhook"
                        className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => webhook.id && onDelete(webhook.id)}
                        aria-label="Delete webhook"
                        disabled={!webhook.id}
                        className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
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
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={theme === 'dark' ? 'border-gray-700' : ''}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`mx-1 ${theme === 'dark' && currentPage !== pageNum ? 'border-gray-700' : ''}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={theme === 'dark' ? 'border-gray-700' : ''}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WebhooksHeader;