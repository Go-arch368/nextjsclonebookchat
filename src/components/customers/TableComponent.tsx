// src/app/components/TableComponent.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

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

export default function TableComponent() {
  const [sortDirection, setSortDirection] = useState<Record<string, "asc" | "desc" | null>>({
    name: null,
    email: null,
    country: null,
    date: null,
    integrations: null,
    plan: null,
    details: null,
  });
  const [data, setData] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customers = await response.json();
        setData(customers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSort = (column: keyof Customer) => {
    const newDirection = sortDirection[column] === "asc" ? "desc" : "asc";
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[column] || "";
      const bValue = b[column] || "";
      if (column === "date") {
        const dateA = aValue ? new Date(aValue.split(" ").join("T")) : new Date(0);
        const dateB = bValue ? new Date(bValue.split(" ").join("T")) : new Date(0);
        return newDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      return newDirection === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setData(sortedData);
  };

  const handleDelete = async (email: string) => {
    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      setData((prevData) => prevData.filter((item) => item.email !== email));
    } catch (err: any) {
      console.error('Delete error:', err.message);
      setError(err.message);
    }
  };

  const getSortIcon = (column: string) => {
    const direction = sortDirection[column];
    if (direction === "asc") return <ArrowUp className="h-4 w-4 ml-2" />;
    if (direction === "desc") return <ArrowDown className="h-4 w-4 ml-2" />;
    return null;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button variant="ghost" onClick={() => handleSort("name")} className="p-0 w-full flex items-center justify-center">
                    <span>Name</span>{getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-2/7 text-center">
                  <Button variant="ghost" onClick={() => handleSort("email")} className="p-0 w-full flex items-center justify-center">
                    <span>Email</span>{getSortIcon("email")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button variant="ghost" onClick={() => handleSort("country")} className="p-0 w-full flex items-center justify-center">
                    <span>Country</span>{getSortIcon("country")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button variant="ghost" onClick={() => handleSort("date")} className="p-0 w-full flex items-center justify-center">
                    <span>Date Added</span>{getSortIcon("date")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button variant="ghost" onClick={() => handleSort("integrations")} className="p-0 w-full flex items-center justify-center">
                    <span>Integrations</span>{getSortIcon("integrations")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button variant="ghost" onClick={() => handleSort("plan")} className="p-0 w-full flex items-center justify-center">
                    <span>Active plan name</span>{getSortIcon("plan")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button variant="ghost" onClick={() => handleSort("details")} className="p-0 w-full flex items-center justify-center">
                    <span>Details</span>{getSortIcon("details")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow key={item._id || index} className="hover:bg-gray-100">
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">{item.name || ''}</TableCell>
                  <TableCell className="px-2 py-3 w-2/7 truncate text-center">{item.email || ''}</TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">{item.country || ''}</TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">{item.date || ''}</TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">{item.integrations || ''}</TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">{item.plan || ''}</TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => item.email && handleDelete(item.email)}
                        disabled={!item.email}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button variant="ghost" className="bg-white p-1 rounded">
                        {item.details || '>'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => paginate(page)}
                className="mx-1"
              >
                {page}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}