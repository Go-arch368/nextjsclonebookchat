"use client";

import React, { useState } from 'react';
import { toast } from "sonner";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Search, Trash2, Plus } from "lucide-react";
import axios from "axios";
import AddUsersForm from './AddUsersForm';
import { User } from '@/types/user';

interface HeaderProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  users: User[];
}

const Header: React.FC<HeaderProps> = ({ setUsers, users }) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPage, setSearchPage] = useState(0);
  const [searchSize] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const API_BASE_URL = `/api/users`; // Use Next.js API route

  const handleFormSubmit = async () => {
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}?action=list`);
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      setUsers(response.data);
      toast.success("User list refreshed successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to refresh users";
      toast.error(errorMessage);
      console.error("Error refreshing users:", errorMessage, error.response?.data);
    }
  };

  const handleSearch = async (page: number = 0) => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    setIsSearching(true);
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}?action=search`, {
        params: { keyword: searchTerm.trim(), page, size: searchSize },
      });
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      const results = response.data;
      if (results.length > 0) {
        setUsers(results);
        setSearchPage(page);
        toast.success(`Found ${results.length} user(s)`);
      } else {
        setUsers([]);
        toast.info("No users found");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to search users";
      toast.error(errorMessage);
      console.error("Search error:", errorMessage, error.response?.data);
      setUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}?action=clear`);
      setUsers([]);
      setSearchPage(0);
      toast.success(response.data.message || "All users cleared successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to clear users";
      toast.error(errorMessage);
      console.error("Clear error:", errorMessage, error.response?.data);
    } finally {
      setIsClearing(false);
    }
  };

  const handleNextPage = () => {
    handleSearch(searchPage + 1);
  };

  const handlePrevPage = () => {
    if (searchPage > 0) {
      handleSearch(searchPage - 1);
    }
  };

  return (
    <header className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Users</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users by email or company..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(0)}
              disabled={isSearching || isClearing}
            />
          </div>
         {/* Search Button */}
<Button
  onClick={() => handleSearch(0)}
  disabled={isSearching || isClearing || !searchTerm.trim()}
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md"
>
  {isSearching ? "Searching..." : "Search"}
</Button>

{/* Add User Button */}
<Button
  onClick={() => setIsAddFormOpen(true)}
  disabled={isSearching || isClearing}
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md"
>
  <Plus className="h-4 w-4" />
  <span>Add User</span>
</Button>

{/* Clear All Button */}
<Button
  onClick={handleClear}
  variant="destructive"
  disabled={isSearching || isClearing || users.length === 0}
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md"
>
  <Trash2 className="h-4 w-4" />
  <span>{isClearing ? "Clearing..." : "Clear All"}</span>
</Button>
        </div>
        {searchTerm && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Showing page {searchPage + 1} for "{searchTerm}"
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={searchPage === 0 || isSearching || isClearing}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={users.length < searchSize || isSearching || isClearing}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        <AddUsersForm
          onSubmit={handleFormSubmit}
          isOpen={isAddFormOpen}
          setIsOpen={setIsAddFormOpen}
        />
      </div>
    </header>
  );
};

export default Header;