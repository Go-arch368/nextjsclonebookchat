"use client";

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';

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
  queuedMessages: QueuedMessage[];
  isLoading: boolean;
  theme?: string;
}

const QueuedMessagesHeader: React.FC<QueuedMessagesHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  queuedMessages,
  isLoading,
  theme = 'light',
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof QueuedMessage;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedMessages = React.useMemo(() => {
    const sortableItems = [...queuedMessages];
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
  }, [queuedMessages, sortConfig]);

  const filteredMessages = sortedMessages.filter(message =>
    message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const requestSort = (key: keyof QueuedMessage) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof QueuedMessage) => {
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
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-4xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Queued Messages
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
              type="text"
              placeholder="Search queued messages"
              className={`w-full pl-10 focus:outline-none rounded-md border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-black'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className={`px-6 py-3 flex items-center gap-3 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
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
            <Skeleton key={index} className={`h-12 w-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      ) : queuedMessages.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button 
            onClick={onAddClick}
            className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Queued Message
          </Button>
        </div>
      ) : (
        <>
          <Table className={`border w-full ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <TableHeader className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
              <TableRow>
                <TableHead className={`px-4 py-4 hover:bg-gray-100 w-1/12 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('message')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    <span>Message</span>
                    {getSortIcon('message')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 hover:bg-gray-100 w-1/12 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('createdBy')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    <span>Created By</span>
                    {getSortIcon('createdBy')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 hover:bg-gray-100 w-1/12 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('company')}
                    className={`p-0 w-full flex items-center justify-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 hover:bg-gray-100 w-1/12 text-center ${
                  theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
              {paginatedMessages.map((item) => (
                <TableRow key={item.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}>
                  <TableCell className={`px-4 py-3 w-1/12 truncate text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.message}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/12 truncate text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.createdBy}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/12 truncate text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.company}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/12 truncate text-center ${
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
                        onClick={() => onDelete(item.id)}
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

export default QueuedMessagesHeader;