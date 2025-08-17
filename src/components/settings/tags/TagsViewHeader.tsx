"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Skeleton } from '@/ui/skeleton';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';

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
}

const TagsViewHeader: React.FC<TagsViewHeaderProps> = ({
  onAddClick,
  onEditClick,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Tag;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/v1/settings/tags');
        if (!response.ok) throw new Error('Failed to fetch tags');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        toast.error('Failed to fetch tags');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/settings/tags?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete tag');
      
      setTags(prev => prev.filter(tag => tag.id !== id));
      toast.success('Tag deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tag');
      console.error(error);
    }
  };

  const sortedTags = React.useMemo(() => {
    const sortableItems = [...tags];
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
  }, [tags, sortConfig]);

  const filteredTags = sortedTags.filter(tag =>
    tag.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTags = filteredTags.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);

  const requestSort = (key: keyof Tag) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Tag) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" /> 
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  return (
    <div className={`p-8 rounded-xl shadow-lg border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-2xl font-semibold text-gray-800 dark:text-white ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Tags</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-[350px] mx-auto">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <Input
              type="text"
              placeholder="Search tags"
              className={`w-full pl-10 py-2 focus:outline-none rounded-md border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-black'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
  className={`flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white`}
  onClick={onAddClick}
>
  <Plus className="w-4 h-4" />
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
      ) : tags.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
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
                    onClick={() => requestSort('tag')}
                    className={`p-0 w-full flex items-center justify-center ${theme === 'dark' ? 'text-white' : ''}`}
                  >
                    <span>Tag</span>
                    {getSortIcon('tag')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} w-1/5 text-center`}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('isDefault')}
                    className={`p-0 w-full flex items-center justify-center ${theme === 'dark' ? 'text-white' : ''}`}
                  >
                    <span>Default</span>
                    {getSortIcon('isDefault')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} w-1/5 text-center`}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('createdBy')}
                    className={`p-0 w-full flex items-center justify-center ${theme === 'dark' ? 'text-white' : ''}`}
                  >
                    <span>Created By</span>
                    {getSortIcon('createdBy')}
                  </Button>
                </TableHead>
                <TableHead className={`px-4 py-4 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} w-1/5 text-center`}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTags.map((item) => (
                <TableRow key={item.id} className={theme === 'dark' ? 'hover:bg-gray-800 border-gray-700' : 'hover:bg-gray-100'}>
                  <TableCell className={`px-4 py-3 w-1/5 text-center ${theme === 'dark' ? 'text-white' : ''}`}>
                    {item.tag}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/5 text-center ${theme === 'dark' ? 'text-white' : ''}`}>
                    {item.isDefault ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/5 text-center ${theme === 'dark' ? 'text-white' : ''}`}>
                    {item.createdBy}
                  </TableCell>
                  <TableCell className={`px-4 py-3 w-1/5 text-center ${theme === 'dark' ? 'text-white' : ''}`}>
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

export default TagsViewHeader;