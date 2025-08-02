"use client";

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Search, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';

// TypeScript interface for the IP address
interface IPAddress {
  id: number;
  userId: number;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface IPAddressesHeaderProps {
  onAddClick: () => void;
  onEditClick: (ipAddress: IPAddress) => void;
  onDelete: (id: number) => void;
  onDeleteAll: () => void;
  onSearch: (keyword: string, page?: number, size?: number) => void;
  ipAddresses: IPAddress[];
  isLoading: boolean;
}

const IPAddressesHeader: React.FC<IPAddressesHeaderProps> = ({
  onAddClick,
  onEditClick,
  onDelete,
  onDeleteAll,
  onSearch,
  ipAddresses,
  isLoading,
}) => {
  const [sortDirection, setSortDirection] = useState<Record<string, 'asc' | 'desc' | null>>({
    ipAddress: null,
    createdAt: null,
    updatedAt: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSort = (column: keyof IPAddress) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...ipAddresses].sort((a, b) => {
      const aValue = a[column] as string;
      const bValue = b[column] as string;
      return newDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    onSearch(searchKeyword, currentPage - 1, 5);
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
  const currentData = ipAddresses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ipAddresses.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onSearch(searchKeyword, pageNumber - 1, itemsPerPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    onSearch(e.target.value, 0, itemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-gray-800">IP Addresses</h1>
        <div className="flex justify-between items-center gap-4">
          <div className="relative w-[850px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search IP addresses"
              value={searchKeyword}
              onChange={handleSearchChange}
              className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg flex items-center gap-2"
              onClick={onDeleteAll}
              disabled={isLoading || ipAddresses.length === 0}
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete All</span>
            </Button>
            <Button
              className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg flex items-center gap-2"
              onClick={onAddClick}
              disabled={isLoading}
            >
              <Plus className="h-5 w-5" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : ipAddresses.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Button onClick={onAddClick} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add IP Address
            </Button>
          </div>
        ) : (
          <>
            <Table className="border border-gray-200 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/3 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('ipAddress')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>IP Address</span>
                      {getSortIcon('ipAddress')}
                    </Button>
                  </TableHead>
                  {/* <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/3 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('createdAt')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>Created At</span>
                      {getSortIcon('createdAt')}
                    </Button>
                  </TableHead>
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/3 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('updatedAt')}
                      className="p-0 w-full flex items-center justify-center"
                    >
                      <span>Updated At</span>
                      {getSortIcon('updatedAt')}
                    </Button>
                  </TableHead> */}
                  <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/3 text-center">
                    <span>Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-100">
                    <TableCell className="px-4 py-3 w-1/3 text-left text-ellipsis overflow-hidden max-w-0 relative left-30">{item.ipAddress}</TableCell>
                    {/* <TableCell className="px-4 py-3 w-1/3 text-center">{item.createdAt}</TableCell>
                    <TableCell className="px-4 py-3 w-1/3 text-center">{item.updatedAt}</TableCell> */}
                    <TableCell className="px-4 py-3 w-1/3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          className="bg-white p-1 rounded-full"
                          onClick={() => onEditClick(item)}
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="bg-white p-1 rounded-full"
                          onClick={() => onDelete(item.id)}
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
                  disabled={isLoading}
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

export default IPAddressesHeader;