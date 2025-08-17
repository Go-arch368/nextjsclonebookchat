"use client";

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Greeting; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE_URL = '/api/settings/greetings';

  

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
      const response = await axios.delete(`${API_BASE_URL}?action=clear`);
      onDelete(0); // Trigger parent refresh
      setCurrentPage(1);
      toast.success(
        response.data?.message || 'All greetings cleared successfully!',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Greetings API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to clear greetings';
      console.error('Clear error:', errorMessage, err.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={`p-8 rounded-xl shadow-lg border ${
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
     <div className="flex items-center justify-between mb-8">
         <h1 className={`text-2xl font-semibold text-gray-800 dark:text-white ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Greetings
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-10 w-full"
              placeholder="Search greetings by title or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      <Button 
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
  onClick={onAddClick}
>
  <Plus className="h-4 w-4" />
  <span>Add</span>
</Button>
          
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="border-b hover:bg-gray-100">
              {['title', 'greeting', 'type', 'visible'].map((key) => (
                <th 
                  key={key} 
                  className="p-2 text-center hover:bg-gray-100 w-1/5"
                >
                  <Button
                    variant="ghost"
                    onClick={() => requestSort(key as keyof Greeting)}
                    className="w-full justify-center"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                    {getSortIcon(key as keyof Greeting)}
                  </Button>
                </th>
              ))}
              <th className="p-2 text-center hover:bg-gray-100 w-1/5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  <Skeleton className="h-8 w-full" />
                </td>
              </tr>
            ) : filteredGreetings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  <Button onClick={onAddClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first greeting
                  </Button>
                </td>
              </tr>
            ) : (
              currentGreetings.map((greeting) => (
                <tr key={greeting.id} className="border-b hover:bg-gray-100">
                  <td className="p-2 text-center truncate">{greeting.title}</td>
                  <td className="p-2 text-center truncate">{greeting.greeting}</td>
                  <td className="p-2 text-center truncate">{greeting.type.replace('_', ' ')}</td>
                  <td className="p-2 text-center truncate">{greeting.visible ? 'Yes' : 'No'}</td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className="p-1 bg-white rounded"
                        onClick={() => onEditClick(greeting)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="p-1 bg-white rounded"
                        onClick={() => greeting.id && onDelete(greeting.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={`mx-1 h-9 px-4 py-2 ${
                currentPage === page 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => paginate(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GreetingHeader;