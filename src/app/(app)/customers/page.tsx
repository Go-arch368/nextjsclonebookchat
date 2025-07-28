// app/customers/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/customers/Header";
import TableComponent from "@/components/customers/TableComponent";
import { Customer } from "@/types/customer";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const API_BASE_URL = "https://zotly.onrender.com/customers";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/list`);
        setCustomers(response.data);
      } catch (error: any) {
        console.error("Error fetching customers:", error.message);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <Header
        setCustomers={setCustomers}
        isAddFormOpen={isAddFormOpen}
        setIsAddFormOpen={setIsAddFormOpen} customers={[]}      />
      <TableComponent
        customers={customers}
        setCustomers={setCustomers}
        openAddCustomerForm={() => setIsAddFormOpen(true)}
      />
    </div>
  );
}