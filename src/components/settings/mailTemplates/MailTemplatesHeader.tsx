
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Search, Plus, Pencil, Trash2, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import mailTemplatesData from './mailTemplatesData.json';

// TypeScript interface for the JSON data
interface TemplateData {
  id: number;
  name: string;
  useCase: string;
  active: boolean;
  createdBy: { name: string; dateTime: string };
  modifiedBy: { name: string; dateTime: string };
}

const MailTemplatesHeader: React.FC = () => {
  const [tableData, setTableData] = useState<TemplateData[]>(mailTemplatesData);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    name: null,
    useCase: null,
    createdBy: null,
    modifiedBy: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (column: keyof TemplateData | 'createdBy' | 'modifiedBy') => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...tableData].sort((a, b) => {
      let aValue: string;
      let bValue: string;
      if (column === 'createdBy' || column === 'modifiedBy') {
        aValue = a[column].name || '';
        bValue = b[column].name || '';
      } else {
        aValue = a[column as keyof TemplateData] as string;
        bValue = b[column as keyof TemplateData] as string;
      }
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
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Mail Templates</h1>
        <div className="flex justify-end items-center gap-4">
         <div className="relative w-[850px] mx-auto">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
  <Input
    type="text"
    placeholder="Search MailTemPlates"
    className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
  />
</div>

          <Button
            className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg flex items-center gap-2"
            onClick={() => console.log('Save clicked')}
          >
            <Plus className="h-5 w-5" />
            <span>Save</span>
          </Button>
        </div>
      </div>
      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : tableData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Button onClick={() => console.log('Save clicked')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Template
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
                      onClick={() => handleSort('name')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>Name</span>
                      {getSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('useCase')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>Use case</span>
                      {getSortIcon('useCase')}
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">
                    <span>Active</span>
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
                      onClick={() => handleSort('modifiedBy')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>Modified By</span>
                      {getSortIcon('modifiedBy')}
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/6 text-center">
                    <span>Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-100">
                    <TableCell className="px-4 py-3 w-1/6 text-left text-ellipsis overflow-hidden max-w-0">{item.name}</TableCell>
                    <TableCell className="px-4 py-3 w-1/6 text-left text-ellipsis overflow-hidden max-w-0">{item.useCase}</TableCell>
                    <TableCell className="px-4 py-3 w-1/6 text-center">
                      {item.active && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                    </TableCell>
                    <TableCell className="px-4 py-3 w-1/6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {/* <span>{item.createdBy.name}</span> */}
                        <span className="text-sm text-gray-600">{item.createdBy.dateTime}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 w-1/6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span>{item.modifiedBy.name}</span>
                        <span className="text-sm text-gray-600">{item.modifiedBy.dateTime}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 w-1/6 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          className="bg-white p-1 rounded-full"
                          onClick={() => console.log(`Edit clicked for ${item.name}`)}
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="bg-white p-1 rounded-full"
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
            <div className="flex justify-center mt-4 gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => paginate(page)}
                  className="px-3 py-1"
                >
                  {page}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MailTemplatesHeader;
