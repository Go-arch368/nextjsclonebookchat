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
import { Edit, Trash2, Check, X } from "lucide-react";
import { Skeleton } from "@/ui/skeleton";

// Import the JSON data
import data from "./data.json";

const TableComponent = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  useEffect(() => {
    // Simulate a delay for loading state
    setTimeout(() => {
      try {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          setError("Data is not in the expected format");
          setCustomers([]);
        }
      } catch (err) {
        setError("Failed to load data");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }, 1200);
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
          {[...Array(5)].map((_, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((__, colIdx) => (
                <Skeleton key={colIdx} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No data available</p>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 py-4 w-2/5 text-center">
                  Domain
                </TableHead>
                <TableHead className="px-2 py-4 w-1/5 text-center">
                  Company
                </TableHead>
                <TableHead className="px-2 py-4 w-1/5 text-center">
                  Date Added
                </TableHead>
                <TableHead className="px-2 py-4 w-1/5 text-center">
                  Active / Verified
                </TableHead>
                <TableHead className="px-2 py-4 w-1/5 text-center">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-100">
                  <TableCell className="px-2 py-5 w-2/5 truncate text-center">
                    {item.domain || ""}
                  </TableCell>
                  <TableCell className="px-2 py-5 w-1/5 truncate text-center">
                    {item.company || ""}
                  </TableCell>
                  <TableCell className="px-2 py-5 w-1/5 truncate text-center">
                    {item.dateAdded || ""}
                  </TableCell>
                  <TableCell className="px-2 py-5 w-1/5 text-center">
                    {item.activeVerified ? (
                      <span className="text-green-700">
                        <Check className="mx-auto" size={16} />
                      </span>
                    ) : (
                      <span className="text-red-700">
                        <X className="mx-auto" size={16} />
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-2 py-5 w-1/5 text-center">
                    <div className="flex justify-center space-x-2">
                      <Edit className="h-4 w-4 text-gray-500 cursor-pointer" />
                      <Trash2 className="h-4 w-4 text-gray-500 cursor-pointer" />
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
