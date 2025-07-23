// src/app/(app)/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/customers/Header";
import TableComponent from "@/components/customers/TableComponent";

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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/customers");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error: any) {
        console.error("Error fetching customers:", error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <Header setCustomers={setCustomers} isAddFormOpen={isAddFormOpen} setIsAddFormOpen={setIsAddFormOpen} />
      <TableComponent
        customers={customers}
        setCustomers={setCustomers}
        openAddCustomerForm={() => setIsAddFormOpen(true)}
      />
    </div>
  );
}