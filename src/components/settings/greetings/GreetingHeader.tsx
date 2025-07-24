
"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import greetingsData from './greetingsData.json';

// TypeScript interface for the JSON data
interface Greeting {
  id: number;
  title: string;
  greeting: string;
  type: string;
  languages: string[];
  createdBy: string;
  company: string;
}

const GreetingHeader: React.FC = () => {
  const [tableData, setTableData] = useState<Greeting[]>(greetingsData);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    title: null,
    greeting: null,
    type: null,
    languages: null,
    createdBy: null,
    company: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (column: keyof Greeting) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...tableData].sort((a, b) => {
      const aValue = column === 'languages' ? a[column].join(', ') : a[column] || '';
      const bValue = column === 'languages' ? b[column].join(', ') : b[column] || '';
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
          <div className="relative w-[350px] mx-auto">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
  <Input
    type="text"
    placeholder="Search greetings"
    className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
  />
</div>

          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-3 rounded-lg"
            onClick={() => console.log('Add clicked')}
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
          <Button onClick={() => console.log('Add clicked')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Greeting
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('title')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Title</span>
                    {getSortIcon('title')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-2/6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('greeting')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Greeting</span>
                    {getSortIcon('greeting')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('type')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Type</span>
                    {getSortIcon('type')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('languages')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Languages</span>
                    {getSortIcon('languages')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('createdBy')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Created By</span>
                    {getSortIcon('createdBy')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('company')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 w-1/6 truncate text-center">{item.title}</TableCell>
                  <TableCell className="px-4 py-3 w-2/6 truncate text-center">{item.greeting}</TableCell>
                  <TableCell className="px-4 py-3 w-1/6 truncate text-center">{item.type}</TableCell>
                  <TableCell className="px-4 py-3 w-1/6 truncate text-center">{item.languages.join(', ')}</TableCell>
                  <TableCell className="px-4 py-3 w-1/6 truncate text-center">{item.createdBy}</TableCell>
                  <TableCell className="px-4 py-3 w-1/6 truncate text-center">{item.company}</TableCell>
                  <TableCell className="px-4 py-3 w-1/6 truncate text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => console.log(`Edit clicked for ${item.title}`)}
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

export default GreetingHeader;
