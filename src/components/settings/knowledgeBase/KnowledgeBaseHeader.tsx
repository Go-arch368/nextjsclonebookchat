"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Upload, Download, Globe, ChevronDown, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Label } from '@/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';

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
  knowledgeBaseRecords: KnowledgeBaseRecord[];
  setKnowledgeBaseRecords: React.Dispatch<React.SetStateAction<KnowledgeBaseRecord[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: (error: string | null) => void;
}

const KnowledgeBaseHeader: React.FC<KnowledgeBaseHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  knowledgeBaseRecords,
  setKnowledgeBaseRecords,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    questionTitle: null,
    answerInformation: null,
    keywords: null,
    websites: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 5;

  const urls = [
    'http://abc.com',
    'http://cisco.com',
    'http://devtestloginwithgoogle.com',
    'http://nicramfaust-test.com',
    'http://nicramitsolutions-test.com',
    'http://oxnia.com',
    'http://test-zapier.com',
    'http://test-zotly-to-drift-flow.com',
    'https://abc.com',
    'https://abc@gmail.com',
    'https://cdpresolution.com',
    'https://chatmetrics.net',
    'https://dasvaan.com',
    'https://delivr.ai',
    'https://doctor.com',
    'https://drift.com',
    'https://faust-it-test.com',
    'https://fox.com',
    'https://getchatmetrics.co',
    'https://homnicra.com',
    'https://localhost.pl',
    'https://n2n2.com',
    'https://nextwebsitetest.com',
    'https://nicramt.com.pl',
    'https://nnni.com',
    'https://ok.com',
    'https://softspawn.ddns.net',
    'https://spacecreatures.com',
    'https://swas.com',
    'https://swastechies.com/chat',
    'https://techska.com',
    'https://techska.com/chattest/',
    'https://techska.com/chattest2/',
    'https://techska.com/test/',
    'https://techska.com/zotlystagingtest/',
    'https://test-duplicate.com',
    'https://test-integrations.com',
    'https://test.ai',
    'https://test.com',
    'https://test.pl',
    'https://testbetazotly.godaddysites.com/',
    'https://testbug.com',
    'https://time.com',
    'https://virtualletterbox.co',
    'https://www.chatmetrics.com',
    'https://www.route.com',
    'https://www.webstack.com.au/',
    'https://zotlychattest.mobirisesite.com/',
  ];

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/knowledge-bases/all?page=${currentPage - 1}&size=${itemsPerPage}`);
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.content)
        ? response.data.content
        : [];
      setKnowledgeBaseRecords(data);
      setTotalPages(response.data.totalPages || Math.ceil(data.length / itemsPerPage) || 1);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch records';
      console.error('Fetch All Error:', err);
      setError(message);
      setKnowledgeBaseRecords([]);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        const handleSearch = async () => {
          try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/knowledge-bases/search?keyword=${encodeURIComponent(searchQuery)}&page=${currentPage - 1}&size=${itemsPerPage}`
            );
            const data = 'content' in response.data ? response.data.content : Array.isArray(response.data) ? response.data : [];
            setKnowledgeBaseRecords(data);
            setTotalPages(response.data.totalPages || Math.ceil(data.length / itemsPerPage) || 1);
          } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Failed to search records';
            console.error('Search Error:', err);
            setError(message);
            setKnowledgeBaseRecords([]);
            toast.error(message, {
              position: 'top-right',
              autoClose: 3000,
            });
          } finally {
            setIsLoading(false);
          }
        };
        handleSearch();
      } else {
        fetchRecords();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchRecords();
    }
  }, [currentPage]);

  const handleSort = (column: keyof KnowledgeBaseRecord) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...knowledgeBaseRecords].sort((a, b) => {
      const aValue = Array.isArray(a[column]) ? a[column].join(', ') : a[column] || '';
      const bValue = Array.isArray(b[column]) ? b[column].join(', ') : b[column] || '';
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setKnowledgeBaseRecords(sortedData);
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.delete(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/knowledge-bases/delete/all`, {
        headers: { 'Content-Type': 'application/json' },
      });
      setKnowledgeBaseRecords([]);
      setCurrentPage(1);
      setTotalPages(1);
      toast.success('All records cleared successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to clear records';
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error clearing records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast.warn('No records selected for deletion.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all(
        selectedRows.map(id => 
          axios.delete(`${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/knowledge-bases/delete/${id}`, {
            headers: { 'Content-Type': 'application/json' },
          })
        )
      );
      const updated = knowledgeBaseRecords.filter(r => !selectedRows.includes(r.id!));
      setKnowledgeBaseRecords(updated);
      setSelectedRows([]);
      setTotalPages(Math.ceil(updated.length / itemsPerPage) || 1);
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
      toast.success('Selected records deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to delete selected records';
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Delete selected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (url: string) => {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  };

  const handleRowCheckboxChange = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSortIcon = (column: string) => {
    const direction = sortDirection[column];
    if (direction === 'asc') return <ArrowUp className="h-4 w-4 ml-2" />;
    if (direction === 'desc') return <ArrowDown className="h-4 w-4 ml-2" />;
    return null;
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const currentRecords = knowledgeBaseRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Base</h2>
        <div className="flex gap-6">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search knowledge base..."
              className="pl-10 py-2 w-full text-black focus:outline-none rounded-md border border-gray-300"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-3 rounded-lg"
            onClick={onAddClick}
          >
            <Plus className="h-5 w-5" />
            Add Record
          </Button>
    
          <Button
            className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
            onClick={handleClearAll}
            disabled={knowledgeBaseRecords.length === 0}
          >
            <Trash2 className="h-5 w-5" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-col w-[350px]">
        <Label className="text-sm font-medium text-gray-700">Website</Label>
        <div className="relative mt-2">
          <div
            className="w-full p-3 border border-gray-300 rounded-md flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setSelectedUrls((prev) => (prev.length > 0 ? [] : urls))}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-500" />
              <span className="text-gray-500">
                {selectedUrls.length > 0 ? `${selectedUrls.length} selected` : 'Select websites'}
              </span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transform transition-transform ${selectedUrls.length > 0 ? 'rotate-180' : ''}`}
            />
          </div>
          {selectedUrls.length > 0 && (
            <div className="absolute w-full max-h-60 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg z-10 mt-1">
              {urls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheckboxChange(url);
                  }}
                >
                  <Checkbox
                    checked={selectedUrls.includes(url)}
                    onCheckedChange={() => handleCheckboxChange(url)}
                    className="h-4 w-4 text-blue-500"
                  />
                  <span className="text-sm text-gray-700 truncate">{url}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2 mt-8">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : knowledgeBaseRecords.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first knowledge base record
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full mt-8">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-[5%] text-center">
                  <Checkbox
                    checked={selectedRows.length === currentRecords.length && currentRecords.length > 0}
                    onCheckedChange={() => {
                      if (selectedRows.length === currentRecords.length) {
                        setSelectedRows([]);
                      } else {
                        setSelectedRows(currentRecords.map((item) => item.id!));
                      }
                    }}
                    className="h-4 w-4 text-blue-500"
                  />
                </TableHead>
                {['questionTitle', 'answerInformation', 'keywords', 'websites'].map((col) => (
                  <TableHead key={col} className="px-4 py-4 hover:bg-gray-100 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(col as keyof KnowledgeBaseRecord)}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      {col === 'questionTitle' ? 'Question/Title' : 
                       col === 'answerInformation' ? 'Answer/Information' : 
                       col.charAt(0).toUpperCase() + col.slice(1)}
                      {getSortIcon(col)}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className="px-4 py-4 hover:bg-gray-100 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 text-center">
                    <Checkbox
                      checked={selectedRows.includes(record.id!)}
                      onCheckedChange={() => handleRowCheckboxChange(record.id!)}
                      className="h-4 w-4 text-blue-500"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{record.questionTitle}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{record.answerInformation}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{record.keywords}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">{record.websites.join(', ')}</TableCell>
                  <TableCell className="px-4 py-3 truncate text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => onEditClick(record)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => record.id && onDelete(record.id)}
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
          {selectedRows.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button
                className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-5 w-5" />
                Delete Selected
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KnowledgeBaseHeader;