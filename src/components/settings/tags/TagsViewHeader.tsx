
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';

interface Tag {
  id: number;
  userId: number;
  tag: string;
  isDefault: boolean;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

interface TagsViewHeaderProps {
  onAddClick: () => void;
  onEditClick: (tag: Tag) => void;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: (error: string | null) => void;
}

const TagsViewHeader: React.FC<TagsViewHeaderProps> = ({
  onAddClick,
  onEditClick,
  tags,
  setTags,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tag; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 4;

  const API_BASE_URL = '/api/v1/settings/tags';

  const sortedTags = useMemo(() => {
    const sortableItems = [...tags];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
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
  }, [tags, sortConfig]);

  const filteredTags = sortedTags.filter(
    (tag) =>
      tag.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage) || 1;

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<Tag[]>(`${API_BASE_URL}?action=list`);
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      setTags(response.data);
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Tags API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to fetch tags';
      console.error('Fetch Error:', err);
      setError(message);
      setTags([]);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        const handleSearch = async () => {
          try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get<Tag[]>(
              `${API_BASE_URL}?action=search&keyword=${encodeURIComponent(searchQuery)}`
            );
            if (!Array.isArray(response.data)) {
              throw new Error('Invalid response format: Expected an array');
            }
            setTags(response.data);
          } catch (err: any) {
            const message =
              err.response?.status === 404
                ? 'Tags API route not found. Please check the server configuration.'
                : err.response?.data?.message || err.message || 'Failed to search tags';
            console.error('Search Error:', err);
            setError(message);
            setTags([]);
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
        fetchTags();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSort = (key: keyof Tag) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.delete(`${API_BASE_URL}?id=${id}`);
      setTags((prev) => {
        const newData = prev.filter((item) => item.id !== id);
        if (newData.length <= (currentPage - 1) * itemsPerPage && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        return newData;
      });
      toast.success('Tag deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Tags API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete tag';
      console.error('Delete Error:', err);
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast.warn('No tags selected for deletion.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all(
        selectedRows.map((id) => axios.delete(`${API_BASE_URL}?id=${id}`))
      );
      const updated = tags.filter((tag) => !selectedRows.includes(tag.id));
      setTags(updated);
      setSelectedRows([]);
      if ((currentPage - 1) * itemsPerPage >= updated.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      toast.success('Selected tags deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Tags API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to delete selected tags';
      console.error('Delete Selected Error:', err);
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.delete(`${API_BASE_URL}?action=clear`);
      setTags([]);
      setCurrentPage(1);
      toast.success('All tags cleared successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? 'Tags API route not found. Please check the server configuration.'
          : err.response?.data?.message || err.message || 'Failed to clear tags';
      console.error('Clear Error:', err);
      setError(message);
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowCheckboxChange = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-2" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-2" />
    );
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Tags</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search tags"
              className="w-full pl-10 py-2 text-black focus:outline-none rounded-md border border-gray-300"
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
            <span>Add</span>
          </Button>
          <Button
            className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 flex items-center gap-3 rounded-lg"
            onClick={handleClearAll}
            disabled={tags.length === 0}
          >
            <Trash2 className="h-5 w-5" />
            Clear All
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(itemsPerPage)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-[5%] text-center">
                  <Checkbox
                    checked={selectedRows.length === currentTags.length && currentTags.length > 0}
                    onCheckedChange={() =>
                      setSelectedRows(
                        selectedRows.length === currentTags.length
                          ? []
                          : currentTags.map((t) => t.id)
                      )
                    }
                    className="h-4 w-4 text-blue-500"
                  />
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('tag')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Tag</span>
                    {getSortIcon('tag')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('createdBy')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Created By</span>
                    {getSortIcon('createdBy')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('company')}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Company</span>
                    {getSortIcon('company')}
                  </Button>
                </TableHead>
                <TableHead className="px-4 py-4 hover:bg-gray-100 w-1/4 text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTags.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-3 text-center">
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onCheckedChange={() => handleRowCheckboxChange(item.id)}
                      className="h-4 w-4 text-blue-500"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/4 text-left text-ellipsis overflow-hidden max-w-0">
                    {item.tag}
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>{item.createdBy}</span>
                      <span className="text-sm text-gray-500">{item.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 w-1/4 truncate text-center">{item.company}</TableCell>
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

export default TagsViewHeader;
