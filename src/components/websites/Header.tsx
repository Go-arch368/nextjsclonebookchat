"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Search, Trash2,Plus } from "lucide-react";
import axios from "axios";
import AddWebsiteForm from "./AddWebsiteForm";
import { Website } from "@/types/website";

interface HeaderProps {
  setWebsites: React.Dispatch<React.SetStateAction<Website[]>>;
  websites: Website[];
}

export default function Header({ setWebsites, websites }: HeaderProps) {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPage, setSearchPage] = useState(0);
  const [searchSize] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const API_BASE_URL = "/api/websites";

  const handleFormSubmit = async () => {
    try {
      const response = await axios.get<Website[]>(`${API_BASE_URL}?action=list`);
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      setWebsites(response.data);
      toast.success("Website list refreshed successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to refresh websites";
      console.error("Error fetching websites:", errorMessage, error.response?.data);
      toast.error(errorMessage);
      setWebsites([]);
    }
  };

  const handleSearch = async (page: number = 0) => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    setIsSearching(true);
    try {
      const response = await axios.get<Website[]>(`${API_BASE_URL}?action=search`, {
        params: { keyword: searchTerm.trim(), page, size: searchSize },
      });
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      const results = response.data;
      if (results.length > 0) {
        setWebsites(results);
        setSearchPage(page);
        toast.success(`Found ${results.length} website(s)`);
      } else {
        setWebsites([]);
        toast.info("No websites found");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to search websites";
      console.error("Search error:", errorMessage, error.response?.data);
      toast.error(errorMessage);
      setWebsites([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}?action=clear`);
      setWebsites([]);
      setSearchPage(0);
      toast.success(response.data?.message || "All websites cleared successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to clear websites";
      console.error("Clear error:", errorMessage, error.response?.data);
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
      <h1 className="text-3xl font-bold">Websites</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search websites by domain or company..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(0)}
              disabled={isSearching || isClearing}
            />
          </div>
          <Button
            onClick={() => handleSearch(0)}
            disabled={isSearching || isClearing || !searchTerm.trim()}
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
          <Button
            onClick={() => setIsAddFormOpen(true)}
            disabled={isSearching || isClearing}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Website
          </Button>
          <Button
            onClick={handleClear}
            variant="destructive"
            disabled={isSearching || isClearing || websites.length === 0}
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
                disabled={websites.length < searchSize || isSearching || isClearing}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        <AddWebsiteForm
          onSubmit={handleFormSubmit}
          isOpen={isAddFormOpen}
          setIsOpen={setIsAddFormOpen}
        />
      </div>
    </header>
  );
}