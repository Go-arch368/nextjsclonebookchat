"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';
import Zapier from './Zapier';
import Drift from './Drift';

interface Integration {
  id: number;
  userId: number;
  service: 'ZAPIER' | 'DRIFT';
  website: string;
  apiKey: string;
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationsHeaderProps {
  onAddClick: () => void;
  onEditClick: (integration: Integration) => void;
}

const IntegrationsHeader: React.FC<IntegrationsHeaderProps> = ({
  onAddClick,
  onEditClick,
}) => {
  const { theme } = useTheme();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    service: null,
    website: null,
    apiKey: null,
    isConfigured: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/v1/settings/integrations');
        setIntegrations(response.data);
      } catch (err) {
        toast.error('Failed to fetch integrations. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        const fetchAll = async () => {
          try {
            setIsLoading(true);
            const response = await axios.get('/api/v1/settings/integrations');
            setIntegrations(response.data);
          } catch (err) {
            toast.error('Failed to fetch integrations. Please try again.');
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

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/v1/settings/integrations?keyword=${encodeURIComponent(query)}&page=${currentPage - 1}&size=10`
      );
      setIntegrations(response.data);
    } catch (err) {
      toast.error('Failed to search integrations. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: keyof Integration) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...integrations].sort((a, b) => {
      const aValue = a[column] || '';
      const bValue = b[column] || '';
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setIntegrations(sortedData);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/v1/settings/integrations?id=${id}`);
      setIntegrations((prev) => prev.filter((item) => item.id !== id));
      toast.success('Integration deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete integration. Please try again.');
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
  const currentData = integrations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(integrations.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const zapierIntegrations = integrations.filter((i) => i.service === 'ZAPIER');
  const driftIntegrations = integrations.filter((i) => i.service === 'DRIFT');

  if (isLoading) {
    return (
      <div className={`p-12 rounded-xl shadow-lg border ${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="animate-pulse space-y-4">
          <Skeleton className={`h-10 w-1/3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="flex justify-between">
            <Skeleton className={`h-10 w-[350px] ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <Skeleton className={`h-10 w-24 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
          <Skeleton className={`h-64 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-12 rounded-xl shadow-lg border ${
      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-3xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Integrations
        </h1>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              type="text"
              placeholder="Search integrations"
              className={`w-full pl-10 ${
                theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'text-black border-gray-300'
              } focus:outline-none rounded-md`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className={`px-6 py-3 ${
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white flex items-center gap-3 rounded-lg`}
            onClick={onAddClick}
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </Button>
        </div>
      </div>
      <hr className={`mt-10 mb-6 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
      }`} />

      <div className="mb-4">
        <h2 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Zapier Integrations ({zapierIntegrations.length})
        </h2>
        <Zapier
          integrations={zapierIntegrations}
          onConfigure={onAddClick}
          onEdit={onEditClick}
        />
      </div>

      <div className="mb-4">
        <h2 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Drift Integrations ({driftIntegrations.length})
        </h2>
        <Drift
          integrations={driftIntegrations}
          onConfigure={onAddClick}
          onEdit={onEditClick}
        />
      </div>

      {integrations.length === 0 ? (
        <div className={`flex justify-center items-center h-64 mt-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        } rounded-lg`}>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        </div>
      ) : (
        <>
          <Table className={`border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          } w-full mt-6`}>
            <TableHeader>
              <TableRow className={theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}>
                <TableHead className="px-4 py-4 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('service')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : ''
                    }`}
                  >
                    <span>Service</span>
                    {getSortIcon('service')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('website')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : ''
                    }`}
                  >
                    <span>Website</span>
                    {getSortIcon('website')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('apiKey')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : ''
                    }`}
                  >
                    <span>API Key</span>
                    {getSortIcon('apiKey')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 w-1/4 text-center">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id} className={theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}>
                  <TableCell className={`px-4 py-3 w-1/4 text-left text-ellipsis overflow-hidden max-w-0 ${
                    theme === 'dark' ? 'text-white' : ''
                  }`}>
                    {item.service}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/4 text-left text-ellipsis overflow-hidden max-w-0 ${
                    theme === 'dark' ? 'text-white' : ''
                  }`}>
                    {item.website}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/4 text-left text-ellipsis overflow-hidden max-w-0 ${
                    theme === 'dark' ? 'text-white' : ''
                  }`}>
                    {item.apiKey}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/4 truncate text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                        onClick={() => onEditClick(item)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
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

export default IntegrationsHeader;