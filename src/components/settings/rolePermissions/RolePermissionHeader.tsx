
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Pencil, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import rolePermissionsData from './rolePermissionsData.json';

// TypeScript interface for the JSON data
interface RoleData {
  id: number;
  userRole: string;
}

const RolePermissionHeader: React.FC = () => {
  const [tableData, setTableData] = useState<RoleData[]>(rolePermissionsData);
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    userRole: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (column: keyof RoleData) => {
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

  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">User role Permissions</h1>
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
            <Button onClick={() => console.log('Add Role clicked')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </div>
        ) : (
          <>
            <Table className="border border-gray-200 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/2 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('userRole')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>User role</span>
                      {getSortIcon('userRole')}
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/2 text-center">
                    <span>Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-100">
                    <TableCell className="px-4 py-3 w-1/2 text-left text-ellipsis overflow-hidden max-w-0">{item.userRole}</TableCell>
                    <TableCell className="px-4 py-3 w-1/2 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          className="bg-white p-1 rounded-full"
                          onClick={() => console.log(`Edit clicked for ${item.userRole}`)}
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
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

export default RolePermissionHeader;
