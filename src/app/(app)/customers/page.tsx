// app/customers/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/customers/Header";
import TableComponent from "@/components/customers/TableComponent";
import { Customer } from "@/types/customer";
import { toast } from "sonner";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const API_BASE_URL = "/api/customers";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${API_BASE_URL}?action=list`);
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response format: Expected an array");
        }
        setCustomers(response.data);
      } catch (error: any) {
        console.error("Error fetching customers:", error.message, error.response?.data);
        toast.error(error.response?.data?.message || "Failed to fetch customers");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <Header
        setCustomers={setCustomers}
        isAddFormOpen={isAddFormOpen}
        setIsAddFormOpen={setIsAddFormOpen}
        customers={customers}
      />
      <TableComponent
        customers={customers}
        setCustomers={setCustomers}
        openAddCustomerForm={() => setIsAddFormOpen(true)}
      />
    </div>
  );
}