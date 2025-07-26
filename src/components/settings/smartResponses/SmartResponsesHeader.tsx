
"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search, Download, Upload } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import smartResponsesData from './smartResponsesData.json';

// TypeScript interface for the JSON data
interface SmartResponse {
  id: number;
  shortcuts: string[];
  response: string;
  createdBy: string;
  company: string;
  createdAt: string;
}

interface SmartResponsesHeaderProps {
  onAddClick: () => void;
  onAddSmartResponse: (smartResponse: any) => void;
  smartResponses: any[];
}

const SmartResponsesHeader: React.FC<SmartResponsesHeaderProps> = ({
  onAddClick,
  onAddSmartResponse,
  smartResponses,
}) => {
  const [tableData, setTableData] = useState<SmartResponse[]>(smartResponsesData);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    shortcuts: null,
    response: null,
    createdBy: null,
    company: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize incoming smartResponses to match legacy interface
  const normalizeSmartResponse = (item: any): SmartResponse => ({
    id: item.id || Date.now(),
    shortcuts: item.shortcuts || [],
    response: item.response || '',
    createdBy: item.createdBy || item.websites?.join(', ') || 'Unknown',
    company: item.company || 'N/A',
    createdAt: item.createdAt || new Date().toISOString(),
  });

  // Initialize tableData
  useEffect(() => {
    const normalizedData = [...smartResponsesData, ...smartResponses].map(normalizeSmartResponse);
    setTableData(normalizedData);
  }, [smartResponses]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (column: keyof SmartResponse) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...tableData].sort((a, b) => {
      const aValue = column === 'shortcuts' ? a.shortcuts.join(', ') : a[column] || '';
      const bValue = column === 'shortcuts' ? b.shortcuts.join(', ') : b[column] || '';
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setTableData(sortedData);
  };

  const handleDelete = (id: number) => {
    setTableData((prevData) => {
      const newData = prevData.filter((item) => item.id !== id);
      if (newData.length <= (currentPage - 1) * 5) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
      return newData;
    });
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
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Smart Responses</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search smart responses"
              className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
            />
          </div>
          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-3 rounded-lg"
            onClick={onAddClick}
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </Button>
          <Button className="bg-gray-800">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="bg-gray-800">
            <Download className="h-4 w-4 " />
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : tableData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Smart Response
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('shortcuts')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Shortcuts</span>
                    {getSortIcon('shortcuts')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('response')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Response</span>
                    {getSortIcon('response')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('createdBy')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Created By</span>
                    {getSortIcon('createdBy')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('company')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/5 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => console.log('Sort Details')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Details</span>
                    {getSortIcon('details')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-1/5 text-left">
                    <div className="flex flex-col gap-1">
                      {item.shortcuts.map((shortcut, index) => (
                        <span key={index} className="bg-gray-400 rounded-full p-2">
                          #{shortcut}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 text-left text-ellipsis overflow-hidden max-w-0">
                    {item.response}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/5 truncate text-center">{item.createdBy}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 truncate text-center">{item.company}</TableCell>
                  <TableCell className="px-4 py-3 w-1/5 truncate text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => console.log(`Edit clicked for ${item.response}`)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
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

export default SmartResponsesHeader;
