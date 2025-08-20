"use client";

import React, { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { Plus, Trash2, ArrowUp, ArrowDown, Search, Pencil } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'sonner';

interface KnowledgeBaseRecord {
  id?: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
  websites: string[];
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
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof KnowledgeBaseRecord;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  
const sortedRecords = useMemo(() => {
  // Ensure knowledgeBaseRecords is always an array
  const records = Array.isArray(knowledgeBaseRecords) ? knowledgeBaseRecords : [];
  const sortableItems = [...records];
  
  if (sortConfig) {
    sortableItems.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
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
    <div className={`p-8 rounded-xl shadow-lg border ${
      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className={`text-2xl font-semibold text-gray-800 dark:text-white ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Knowledge Base
        </h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative  w-[350px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <Input
            
              placeholder="Search knowledge base"
              className={`w-full pl-10 py-2 focus:outline-none rounded-md border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''
              }`}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-4">
           
           {/* Add Button - Structure updated, original blue colors kept */}
<Button 
  onClick={onAddClick}
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
>
  <Plus className="h-5 w-5" />
  <span>Add</span>
</Button>
          </div>
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
      ) : knowledgeBaseRecords.length === 0 ? (
        <div className={`flex justify-center items-center h-64 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
        }`}>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Knowledge Base Record
          </Button>
        </div>
      ) : (
        <>
          <div className={`rounded-md border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <Table>
              <TableHeader className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
                <TableRow>
                  {['questionTitle', 'answerInformation', 'keywords'].map((key) => (
                    <TableHead 
                      key={key}
                      className={`hover:bg-opacity-50 px-4 py-4 text-center ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => requestSort(key as keyof KnowledgeBaseRecord)}
                        className="p-0 w-full flex items-center justify-center"
                      >
                        <span className={theme === 'dark' ? 'text-white' : ''}>
                          {key === 'questionTitle' ? 'Question/Title' : 
                           key === 'answerInformation' ? 'Answer/Information' : 'Keywords'}
                        </span>
                        {getSortIcon(key as keyof KnowledgeBaseRecord)}
                      </Button>
                    </TableHead>
                  ))}
                  <TableHead className={`px-4 py-4 text-center ${
                    theme === 'dark' ? 'text-white' : ''
                  }`}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((item) => (
                  <TableRow key={item.id} className={theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                    <TableCell className={`px-4 py-3 text-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.questionTitle}
                    </TableCell>
                    <TableCell className={`px-4 py-3 text-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.answerInformation}
                    </TableCell>
                    <TableCell className={`px-4 py-3 text-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.keywords}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditClick(item)}
                        >
                          <Pencil className={`h-4 w-4 ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                          }`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => item.id && onDelete(item.id)}
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
          </div>

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