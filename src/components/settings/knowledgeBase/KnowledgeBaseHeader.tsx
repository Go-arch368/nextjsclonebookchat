"use client";

import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Search,Pencil } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'sonner';

interface KnowledgeBaseRecord {
  id?: number;
  userId?: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
  websites: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface KnowledgeBaseHeaderProps {
  onAddClick: () => void;
  onEditClick: (record: KnowledgeBaseRecord) => void;
  onDelete: (id: number) => void;
  onDeleteAll: () => void;
  onSearch: (keyword: string) => void;
  knowledgeBaseRecords: KnowledgeBaseRecord[];
  isLoading: boolean;
}

const KnowledgeBaseHeader: React.FC<KnowledgeBaseHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  onDeleteAll,
  onSearch,
  knowledgeBaseRecords,
  isLoading,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof KnowledgeBaseRecord;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

 const sortedRecords = React.useMemo(() => {
  const sortableItems = [...knowledgeBaseRecords];
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
}, [knowledgeBaseRecords, sortConfig]);

  const filteredRecords = sortedRecords.filter(record =>
    record.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.answerInformation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.keywords.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const requestSort = (key: keyof KnowledgeBaseRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof KnowledgeBaseRecord) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Knowledge Base</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search knowledge base"
              className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
            onClick={onDeleteAll}
            disabled={knowledgeBaseRecords.length === 0}
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete All</span>
          </Button>
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
      ) : knowledgeBaseRecords.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Knowledge Base Record
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('questionTitle')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Question/Title</span>
                    {getSortIcon('questionTitle')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('answerInformation')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Answer/Information</span>
                    {getSortIcon('answerInformation')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('keywords')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Keywords</span>
                    {getSortIcon('keywords')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-1/4 text-left text-ellipsis overflow-hidden max-w-0">
                    {item.questionTitle}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/4 text-left text-ellipsis overflow-hidden max-w-0">
                    {item.answerInformation}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/4 text-left text-ellipsis overflow-hidden max-w-0">
                    {item.keywords}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/4 truncate text-center">
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
                        onClick={() => item.id && onDelete(item.id)}
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

export default KnowledgeBaseHeader;