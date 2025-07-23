// src/components/TableComponent.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { Edit, Trash2, CircleUser } from "lucide-react";
import { Skeleton } from "@/ui/skeleton";

// Import the JSON data directly
import userData from "./data.json";

interface User {
  "First Name": string;
  "Last Name": string;
  "Role": string;
  "Email": string;
  "Job Title": string;
  "Department": string;
  "Company": string;
  "Date Added": string;
}

const TableComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  useEffect(() => {
    setTimeout(() => {
      try {
        if (Array.isArray(userData)) {
          setUsers(userData);
        } else {
          setError("Data is not in the expected format");
        }
      } catch (err) {
        setError("Failed to load data");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }, 1200); // simulate loading
  }, []);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-auto p-6">
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="grid grid-cols-9 gap-2">
              {[...Array(9)].map((__, colIdx) => (
                <Skeleton key={colIdx} className="h-10 w-full rounded" />
              ))}
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No data available</p>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">First Name</TableHead>
                <TableHead className="text-center">Last Name</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Job Title</TableHead>
                <TableHead className="text-center">Department</TableHead>
                <TableHead className="text-center">Company</TableHead>
                <TableHead className="text-center">Date Added</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((user, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="py-4 text-center flex items-center justify-center">
                    <CircleUser size={18} className="mr-2" />
                    {user["First Name"] || "N/A"}
                  </TableCell>
                  <TableCell className="px-2 py-4 text-center">{user["Last Name"] || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.Role || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.Email || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user["Job Title"] || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.Department || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.Company || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user["Date Added"] || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Edit className="h-4 w-4 text-gray-500 cursor-pointer hover:text-blue-600" />
                      <Trash2 className="h-4 w-4 text-gray-500 cursor-pointer hover:text-red-600" />
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
};

export default TableComponent;
