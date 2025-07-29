// src/components/users/Header.tsx
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

  const API_BASE_URL = "https://zotly.onrender.com/users";

  const handleFormSubmit = async (data: User) => {
    try {
      const payload = {
        ...data,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      };
      console.log("POST /save payload:", payload);
      const response = await axios.post(`${API_BASE_URL}/save`, payload);
      console.log("POST /save response:", response.data);
      const updatedUsers = await axios.get(`${API_BASE_URL}/list`);
      setUsers(updatedUsers.data || []);
      toast.success("User added successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to add user";
      console.error("Error adding user:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSearch = async (page: number = 0) => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    setIsSearching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { keyword: searchTerm.trim(), page, size: searchSize },
      });
      console.log("GET /search response:", response.data);
      const results = response.data;
      if (Array.isArray(results)) {
        if (results.length > 0) {
          setUsers(results);
          setSearchPage(page);
          toast.success(`Found ${results.length} user(s)`);
        } else {
          setUsers([]);
          toast.info("No users found");
        }
      } else {
        console.error("Unexpected response format:", results);
        toast.error("Invalid response from server");
        setUsers([]);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to search users";
      console.error("Search error:", errorMessage, error.response?.status);
      toast.error(errorMessage);
      setUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/clear`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("DELETE /clear response:", response.data);
      setUsers([]);
      toast.success(response.data?.message || "All users cleared successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to clear users";
      console.error("Clear error:", errorMessage);
      toast.error(errorMessage);
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
      <h1 className="text-3xl font-bold">Users</h1>
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
          <Button onClick={() => handleSearch(0)} disabled={isSearching || isClearing || !searchTerm.trim()}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
          <AddUsersForm
            onSubmit={handleFormSubmit}
            isOpen={isAddFormOpen}
            setIsOpen={setIsAddFormOpen}
          />
          <Button
            onClick={handleClear}
            variant="destructive"
            disabled={isSearching || isClearing}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isClearing ? "Clearing..." : "Clear All"}
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
      </div>
    </header>
  );
};

export default Header;