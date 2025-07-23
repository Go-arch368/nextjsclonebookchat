// src/components/Header.tsx
"use client";

import React, { useState } from 'react';
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Plus, Search, Upload, Download } from "lucide-react";
import AddUsersForm from './AddUsersForm';

interface User {
  _id?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  simultaneousChatLimit?: number;
}

interface HeaderProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const Header: React.FC<HeaderProps> = ({ setUsers }) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  const handleFormSubmit = async (data: User) => {
    setUsers((prev) => [...prev, { ...data, _id: Date.now().toString() }]); // Optimistic update
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const updatedUsers = await response.json();
      setUsers(updatedUsers); // Sync with DB
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <header className="space-y-4 p-6">
      <h1 className="text-3xl font-bold">Users</h1>
      <div className="flex items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full pl-10"
          />
        </div>
        <AddUsersForm
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