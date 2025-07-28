// components/customers/Header.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Search, Trash2 } from "lucide-react";
import axios from "axios";
import AddCustomerForm from "./AddCustomerForm";
import { Customer } from "@/types/customer";

interface HeaderProps {
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  isAddFormOpen: boolean;
  setIsAddFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customers: Customer[]; // Add customers prop
}

export default function Header({
  setCustomers,
  isAddFormOpen,
  setIsAddFormOpen,
  customers,
}: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPage, setSearchPage] = useState(0);
  const [searchSize] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const API_BASE_URL = "https://zotly.onrender.com/customers";

  const handleFormSubmit = async (data: Customer) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`);
      setCustomers(response.data);
      toast.success("Customer list refreshed after adding new customer");
    } catch (error: any) {
      console.error("Error fetching customers:", error.message);
      toast.error("Failed to refresh customer list");
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
      const results = response.data;
      if (Array.isArray(results) && results.length > 0) {
        setCustomers(results);
        setSearchPage(page);
        toast.success(`Found ${results.length} customer(s)`);
      } else {
        setCustomers([]);
        toast.info("No customers found");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to search customers";
      console.error("Error searching customers:", errorMessage);
      toast.error(errorMessage);
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
      setCustomers([]);
      toast.success(response.data?.message || "All customers cleared successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to clear customers";
      console.error("Error clearing customers:", errorMessage);
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
      <h1 className="text-3xl font-bold">Customers</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search customers by name or email..."
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
            onClick={handleClear}
            variant="destructive"
            disabled={isSearching || isClearing}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isClearing ? "Clearing..." : "Clear All"}
          </Button>
          <AddCustomerForm
            onSubmit={handleFormSubmit}
            isOpen={isAddFormOpen}
            setIsOpen={setIsAddFormOpen}
          />
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
                disabled={customers.length < searchSize || isSearching || isClearing}
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