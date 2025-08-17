"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';

interface EyeCatcher {
  id: number;
  userId: number;
  title: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  imageUrl: string | null;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface EyeCatcherHeaderProps {
  onAddClick: () => void;
  onEditClick: (eyeCatcher: EyeCatcher) => void;
  eyeCatchers: EyeCatcher[];
  onRefresh: () => void;
  isLoading: boolean;
  setError: (error: string | null) => void;
  theme?: string;
}

const EyeCatcherHeader: React.FC<EyeCatcherHeaderProps> = ({
  onAddClick,
  onEditClick,
  eyeCatchers,
  onRefresh,
  isLoading,
  setError,
  theme = 'light',
}) => {
  const [tableData, setTableData] = useState<EyeCatcher[]>(eyeCatchers);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    title: null,
    createdBy: null,
    company: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE_URL = '/api/settings/eye-catchers';

  useEffect(() => {
    const filteredData = eyeCatchers.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTableData(filteredData);
  }, [eyeCatchers, searchQuery]);

  const handleSort = (column: keyof EyeCatcher) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...tableData].sort((a, b) => {
      const aValue = a[column] || '';
      const bValue = b[column] || '';
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setTableData(sortedData);
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      const response = await axios.delete(`${API_BASE_URL}?id=${id}`);
      setTableData((prev) => prev.filter((item) => item.id !== id));
      toast.success(
        response.data?.message || 'Eye catcher deleted successfully!',
        {
          position: 'top-right',
          autoClose: 3000,
          theme: theme === 'dark' ? 'dark' : 'light',
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Eye catchers API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete eye catcher';
      console.error('Delete error:', errorMessage, err.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    }
  };

  const handleClearAll = async () => {
    try {
      setError(null);
      const response = await axios.delete(`${API_BASE_URL}?action=clear`);
      setTableData([]);
      toast.success(
        response.data?.message || 'All eye catchers cleared successfully!',
        {
          position: 'top-right',
          autoClose: 3000,
          theme: theme === 'dark' ? 'dark' : 'light',
        }
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 404
          ? 'Eye catchers API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to clear eye catchers';
      console.error('Clear error:', errorMessage, err.response?.data);
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        theme: theme === 'dark' ? 'dark' : 'light',
      });
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
  const currentData = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={`p-8 rounded-xl shadow-lg border ${
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-2xl font-semibold text-gray-800 dark:text-white ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Eye Catcher
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              type="text"
              placeholder="Search by title"
              className={`w-full pl-10 py-2 rounded-md border focus:outline-none ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-black'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
   

{/* Empty State Add Button - Keeping original color */}
<Button 
  onClick={onAddClick}
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark' 
      ? 'bg-blue-600 hover:bg-blue-700' 
      : 'bg-blue-500 hover:bg-blue-600'
  } text-white`}
>
  <Plus className="w-4 h-4" />
  <span>Add </span>
</Button>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className={`h-12 w-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      ) : tableData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button 
            onClick={onAddClick}
            className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Eye Catcher
          </Button>
        </div>
      ) : (
        <>
          <Table className={`w-full border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <TableHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
              <TableRow>
                <TableHead className={`px-4 py-4 w-2/5 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('title')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    <span>Title</span>
                    {getSortIcon('title')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 w-1/5 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('createdBy')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    <span>Created By</span>
                    {getSortIcon('createdBy')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 w-1/5 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('company')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 w-1/5 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
              {currentData.map((item) => (
                <TableRow key={item.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}>
                  <TableCell className={`px-4 py-3 w-2/5 truncate text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.title}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/5 truncate text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.createdBy}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/5 truncate text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.company}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/5 truncate text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
                        }`}
                        onClick={() => onEditClick(item)}
                      >
                        <Pencil className={`h-4 w-4 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                        }`} />
                      </Button>
                      <Button
                        variant="ghost"
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
                        }`}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className={`h-4 w-4 ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-500'
                        }`} />
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
                className={`mx-1 ${
                  theme === 'dark' && currentPage !== page
                    ? 'border-gray-600 text-white hover:bg-gray-700'
                    : ''
                }`}
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

export default EyeCatcherHeader;