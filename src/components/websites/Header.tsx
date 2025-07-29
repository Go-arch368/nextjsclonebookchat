// components/websites/Header.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Search, Trash2, Plus } from "lucide-react";
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

  const API_BASE_URL = "https://zotly.onrender.com/websites";

  const handleFormSubmit = async (data: Website) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`);
      console.log("GET /list after form submit:", response.data); // Debug log
      setWebsites(response.data || []);
      toast.success("Website list refreshed after adding new website");
    } catch (error: any) {
      console.error("Error fetching websites:", error.message);
      toast.error("Failed to refresh website list");
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
      console.log("GET /search response:", response.data); // Debug log
      const results = response.data;
      if (Array.isArray(results)) {
        if (results.length > 0) {
          setWebsites(results);
          setSearchPage(page);
          toast.success(`Found ${results.length} website(s)`);
        } else {
          setWebsites([]);
          toast.info("No websites found");
        }
      } else {
        console.error("Unexpected response format:", results);
        toast.error("Invalid response from server");
        setWebsites([]);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to search websites";
      console.error("Search error:", errorMessage, error.response?.status); // Debug log
      toast.error(errorMessage);
      setWebsites([]);
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
      console.log("DELETE /clear response:", response.data); // Debug log
      setWebsites([]);
      toast.success(response.data?.message || "All websites cleared successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to clear websites";
      console.error("Clear error:", errorMessage); // Debug log
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
          <Button onClick={() => handleSearch(0)} disabled={isSearching || isClearing || !searchTerm.trim()}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
          <AddWebsiteForm
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
                disabled={websites.length < searchSize || isSearching || isClearing}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}