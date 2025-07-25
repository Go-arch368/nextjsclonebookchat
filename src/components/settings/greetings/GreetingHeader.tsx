
"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import greetingsData from './greetingsData.json';

// TypeScript interface for the JSON data
interface Translation {
  language: string;
  greeting: string;
}

interface Greeting {
  id: number;
  title: string;
  greeting: string;
  type: string;
  translations: Translation[];
}

interface GreetingHeaderProps {
  onAddClick: () => void;
  onAddGreeting: (greeting: Greeting) => void;
  greetings: Greeting[];
}

const GreetingHeader: React.FC<GreetingHeaderProps> = ({ onAddClick, onAddGreeting, greetings }) => {
  const [tableData, setTableData] = useState<Greeting[]>([]);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    title: null,
    greeting: null,
    type: null,
    translations: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Normalize data to ensure translations is always an array
  const normalizeGreeting = (item: any): Greeting => ({
    id: item.id || Date.now(),
    title: item.title || '',
    greeting: item.greeting || '',
    type: item.type || '',
    translations: Array.isArray(item.translations)
      ? item.translations
      : item.languages
        ? [{ language: item.languages.join(', '), greeting: item.greeting || '' }]
        : [],
  });

  // Initialize tableData
  useEffect(() => {
    const normalizedData = [...greetingsData, ...greetings].map(normalizeGreeting);
    setTableData(normalizedData);
  }, [greetings]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (column: keyof Greeting) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...tableData].sort((a, b) => {
      const aValue = column === 'translations' ? a[column].map(t => t.language).join(', ') : a[column] || '';
      const bValue = column === 'translations' ? b[column].map(t => t.language).join(', ') : b[column] || '';
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
        <h2 className="text-4xl font-bold text-gray-800">Greetings</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search greetings"
              className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
            />
          </div>
          <Button
            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-800 flex items-center gap-3 rounded-lg"
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
      ) : tableData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Greeting
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
                    onClick={() => handleSort('title')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Title</span>
                    {getSortIcon('title')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('greeting')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Greeting</span>
                    {getSortIcon('greeting')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('type')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Type</span>
                    {getSortIcon('type')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('translations')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Languages</span>
                    {getSortIcon('translations')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-1/4 truncate text-center">{item.title}</TableCell>
                  <TableCell className="px-4 py-3 w-1/4 truncate text-center">{item.greeting}</TableCell>
                  <TableCell className="px-4 py-3 w-1/4 truncate text-center">{item.type}</TableCell>
                  <TableCell className="px-4 py-3 w-1/4 truncate text-center">
                    {item.translations.length > 0 ? item.translations.map(t => t.language).join(', ') : '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/6 truncate text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => console.log(`Edit clicked for ${item.title}`)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
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
                className="mx-1"
                onClick={() => paginate(page)}
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
