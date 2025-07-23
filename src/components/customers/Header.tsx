// src/components/Header.tsx
"use client";

import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Plus, Search } from "lucide-react";
import AddCustomerForm from "./AddCustomerForm";

export default function Header() {
  const handleFormSubmit = (data: any) => {
    console.log("New customer added:", data);
    // Add logic to update data (e.g., via state or API)
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