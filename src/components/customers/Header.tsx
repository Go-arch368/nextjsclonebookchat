// src/components/Header.tsx
"use client";

import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Plus, Search } from "lucide-react";
import AddCustomerForm from "./AddCustomerForm";

interface Customer {
  _id?: string;
  name?: string;
  email?: string;
  country?: string;
  date?: string;
  integrations?: string;
  plan?: string;
  details?: string;
}

export default function Header({ setCustomers }: { setCustomers: React.Dispatch<React.SetStateAction<Customer[]>> }) {
  const handleFormSubmit = async (data: Customer) => {
    setCustomers((prev) => [...prev, { ...data, _id: Date.now().toString() }]); // Optimistic update
    try {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      const updatedCustomers = await response.json();
      setCustomers(updatedCustomers); // Sync with DB
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  return (
    <header className="space-y-4 p-6">
      <h1 className="text-3xl font-bold">Customers</h1>
      <div className="flex items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full pl-10"
          />
        </div>
        <AddCustomerForm onSubmit={handleFormSubmit} />
      </div>
    </header>
  );
}