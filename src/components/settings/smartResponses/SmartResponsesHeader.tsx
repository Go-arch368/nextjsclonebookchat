"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';

interface SmartResponse {
  id: number;
  userId: number;
  response: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  shortcuts: string[];
  websites: string[];
}

interface SmartResponsesHeaderProps {
  onAddClick: () => void;
  onEditClick: (response: SmartResponse) => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
  smartResponses: SmartResponse[];
  isLoading: boolean;
  error: string | null;
  theme?: string;
}

const SmartResponsesHeader: React.FC<SmartResponsesHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  onClearAll,
  smartResponses,
  isLoading,
  error,
  theme = 'light',
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SmartResponse;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedResponses = React.useMemo(() => {
    const sortableItems = [...smartResponses];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = Array.isArray(a[sortConfig.key])
          ? (a[sortConfig.key] || [])
          : (a[sortConfig.key] ?? '');
        const bValue = Array.isArray(b[sortConfig.key])
          ? (b[sortConfig.key] || [])
          : (b[sortConfig.key] ?? '');

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
  }, [smartResponses, sortConfig]);

  const filteredResponses = sortedResponses.filter(response =>
    response.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.shortcuts.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    response.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedResponses = filteredResponses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);

  const requestSort = (key: keyof SmartResponse) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof SmartResponse) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  return (
    <div className={`p-8 rounded-xl shadow-lg border ${
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      {error && (
        <div className={`mb-4 p-4 rounded ${
          theme === 'dark'
            ? 'bg-red-900 text-red-200'
            : 'bg-red-100 text-red-700'
        }`}>
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-2xl font-semibold text-gray-800 dark:text-white ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Smart Responses
        </h2>
        <div className="flex gap-4">
          <div className="relative w-[350px]">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              placeholder="Search responses..."
              className={`pl-10 w-full ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : ''
              }`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* Add New Button */}
<Button 
  onClick={onAddClick} 
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md ${
    theme === 'dark'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-blue-600 hover:bg-blue-700'
  } text-white`}
>
  <Plus className="w-4 h-4" />
  Add New
</Button>
        
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(itemsPerPage)].map((_, i) => (
            <Skeleton key={i} className={`h-12 w-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      ) : smartResponses.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button 
            onClick={onAddClick}
            className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create your first smart response
          </Button>
        </div>
      ) : (
        <>
          <Table className={`border w-full ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <TableHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
              <TableRow>
                {['shortcuts', 'response', 'createdBy', 'company'].map((col) => (
                  <TableHead key={col} className={`px-4 py-4 ${
                    theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(col as keyof SmartResponse)}
                      className={`p-0 w-full flex items-center justify-start ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                      {getSortIcon(col as keyof SmartResponse)}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className={`px-4 py-4 ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                } text-right`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
              {paginatedResponses.map((response) => (
                <TableRow key={response.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}>
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {response.shortcuts.map((shortcut) => (
                        <span key={shortcut} className={`px-2 py-1 rounded text-xs ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          #{shortcut}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className={`px-4 py-3 max-w-xs truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {response.response}
                  </TableCell>
                  <TableCell className={`px-4 py-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {response.createdBy}
                  </TableCell>
                  <TableCell className={`px-4 py-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {response.company}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditClick(response)}
                        className={theme === 'dark' ? 'hover:bg-gray-600' : ''}
                      >
                        <Pencil className={`h-4 w-4 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                        }`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(response.id)}
                        className={theme === 'dark' ? 'hover:bg-gray-600' : ''}
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

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
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
          )}
        </>
      )}
    </div>
  );
};

export default SmartResponsesHeader;