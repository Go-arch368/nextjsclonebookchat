"use client";

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

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
  onSearch: (keyword: string) => void;
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
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IPAddress;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { theme } = useTheme();
  const itemsPerPage = 5;

  const sortedIPAddresses = React.useMemo(() => {
    const sortableItems = [...ipAddresses];
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
  }, [ipAddresses, sortConfig]);

  const filteredIPAddresses = sortedIPAddresses.filter(ipAddress =>
    ipAddress.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedIPAddresses = filteredIPAddresses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredIPAddresses.length / itemsPerPage);

  const requestSort = (key: keyof IPAddress) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof IPAddress) => {
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
    <div className={`p-8 rounded-xl shadow-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-2xl font-semibold text-gray-800 dark:text-white ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>IP Addresses</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <Input
              type="text"
              placeholder="Search IP addresses"
              className={`w-full pl-10 py-2 focus:outline-none rounded-md border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-black'}`}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        
      <Button
  className="flex items-center gap-2 px-4 py-2.5 border text-base rounded-md bg-blue-500 hover:bg-blue-600 text-white"
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
            <Skeleton key={index} className={`h-12 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
          ))}
        </div>
      ) : ipAddresses.length === 0 ? (
        <div className={`flex justify-center items-center h-64 ${theme === 'dark' ? 'text-white' : ''}`}>
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add IP Address
          </Button>
        </div>
      ) : (
        <>
          <Table className={`border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} w-full`}>
            <TableHeader className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
              <TableRow>
                <TableHead className={`px-4 py-4 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} w-1/5 text-center`}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('ipAddress')}
                    className={`p-0 w-full flex items-center justify-center ${theme === 'dark' ? 'text-white' : ''}`}
                  >
                    <span>IP Address</span>
                    {getSortIcon('ipAddress')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} w-1/5 text-center`}>
                  <span className={theme === 'dark' ? 'text-white' : ''}>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedIPAddresses.map((item) => (
                <TableRow key={item.id} className={theme === 'dark' ? 'hover:bg-gray-800 border-gray-700' : 'hover:bg-gray-100'}>
                  <TableCell className={`px-4 py-3 w-1/5 text-center text-ellipsis overflow-hidden max-w-0 ${theme === 'dark' ? 'text-white' : ''}`}>
                    {item.ipAddress}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/5 truncate text-center ${theme === 'dark' ? 'text-white' : ''}`}>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'}`}
                        onClick={() => onEditClick(item)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'}`}
                        onClick={() => onDelete(item.id)}
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
                  className={`mx-1 ${theme === 'dark' && currentPage !== page ? 'border-gray-700' : ''}`}
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

export default IPAddressesHeader;