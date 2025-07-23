// src/components/Header.tsx
"use client";

import React, { useState } from 'react';
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Plus, Search, Upload, Download } from "lucide-react";
import AddWebsiteForm from './AddWebsiteForm';

interface Website {
  _id?: string;
  protocol?: string;
  domain?: string;
  company?: string;
  category?: string;
}

interface HeaderProps {
  setWebsites: React.Dispatch<React.SetStateAction<Website[]>>;
}

const Header: React.FC<HeaderProps> = ({ setWebsites }) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  const handleFormSubmit = async (data: Website) => {
    setWebsites((prev) => [...prev, { ...data, _id: Date.now().toString() }]); // Optimistic update
    try {
      const response = await fetch("/api/websites");
      if (!response.ok) throw new Error("Failed to fetch websites");
      const updatedWebsites = await response.json();
      setWebsites(updatedWebsites); // Sync with DB
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  };

  return (
    <header className="space-y-4 p-6">
      <h1 className="text-3xl font-bold">Website</h1>
      <div className="flex items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search websites..."
            className="w-full pl-10"
          />
        </div>
        <AddWebsiteForm
          onSubmit={handleFormSubmit}
          isOpen={isAddFormOpen}
          setIsOpen={setIsAddFormOpen}
        />
        <Button className="bg-black">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button className="bg-black">
          <Download className="h-4 w-4 mr-2" />
        </Button>
      </div>
    </header>
  );
};

export default Header;