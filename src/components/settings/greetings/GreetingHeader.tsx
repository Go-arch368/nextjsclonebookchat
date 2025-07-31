"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';

interface Greeting {
  id?: number;
  title: string;
  greeting: string;
  type: string;
  visible: boolean;
}

interface GreetingHeaderProps {
  onAddClick: () => void;
  onEditClick: (greeting: Greeting) => void;
  onDelete: (id: number) => void;
  greetings: Greeting[];
  isLoading: boolean;
  setError: (error: string | null) => void;
}

const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  greetings = [],
  isLoading,
  setError,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Greeting; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedGreetings = React.useMemo(() => {
    const sortableItems = [...greetings];
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
  }, [greetings, sortConfig]);

  const filteredGreetings = sortedGreetings.filter(greeting =>
    greeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    greeting.greeting.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGreetings = filteredGreetings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGreetings.length / itemsPerPage);

  const requestSort = (key: keyof Greeting) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Greeting) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleClearAll = async () => {
    try {
      setError(null);
      await axios.delete('https://zotly.onrender.com/settings/greetings/clear');
      onDelete(0); // Trigger parent refresh
      setCurrentPage(1);
      toast.success('All greetings cleared successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to clear greetings.';
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error clearing greetings:', err);
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Greetings</h2>
        <div className="flex gap-6">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search greetings..."
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
            Add Greeting
          </Button>
          <Button
            className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
            onClick={handleClearAll}
            disabled={greetings.length === 0}
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
      ) : filteredGreetings.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first greeting
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                {['title', 'greeting', 'type', 'visible'].map((key) => (
                  <TableHead key={key} className="px-4 py-4 hover:bg-gray-100 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(key as keyof Greeting)}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {getSortIcon(key as keyof Greeting)}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className="px-4 py-4 hover:bg-gray-100 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentGreetings.map((greeting) => (
                <TableRow key={greeting.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 truncate text-center">{greeting.title}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{greeting.greeting}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{greeting.type}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{greeting.visible ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => onEditClick(greeting)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => greeting.id && onDelete(greeting.id)}
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

export default GreetingHeader;