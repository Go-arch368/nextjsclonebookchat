// components/customers/TableComponent.tsx
"use client";

import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";
import { ArrowUp, ArrowDown, Trash2, Plus, Edit } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Customer } from "@/types/customer";

import { useTheme } from "next-themes";

interface TableComponentProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  openAddCustomerForm: () => void;
}

export default function TableComponent({
  customers,
  setCustomers,
  openAddCustomerForm,
}: TableComponentProps) {
  const [sortDirection, setSortDirection] = useState<
    Record<string, "asc" | "desc" | null>
  >({
    name: null,
    email: null,
    country: null,
    dateAdded: null,
    integrations: null,
    activePlanName: null,
    status: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const { resolvedTheme } = useTheme();
  const API_BASE_URL = "/api/customers";

  setTimeout(() => setIsLoading(false), 1000);

  const handleSort = (column: keyof Customer) => {
    const newDirection = sortDirection[column] === "asc" ? "desc" : "asc";
    setSortDirection((prev) => ({ ...prev, [column]: newDirection }));
    const sortedData = [...customers].sort((a, b) => {
      const aValue = a[column] || "";
      const bValue = b[column] || "";
      if (column === "dateAdded" || column === "createdAt" || column === "updatedAt") {
        const dateA = aValue ? new Date(aValue) : new Date(0);
        const dateB = bValue ? new Date(bValue) : new Date(0);
        return newDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      return newDirection === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
    setCustomers(sortedData);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}?id=${id}`);
      setCustomers((prevData) => {
        const newData = prevData.filter((item) => item.id !== id);
        if (newData.length <= (currentPage - 1) * 3) {
          setCurrentPage((prev) => Math.max(1, prev - 1));
        }
        return newData;
      });
      toast.success(response.data?.message || `Customer ${id} deleted successfully!`);
    } catch (error: any) {
      console.error(`Error deleting customer ${id}:`, error.message, error.response?.data);
      toast.error(error.response?.data?.message || `Failed to delete customer ${id}`);
    }
  };

  const handleUpdate = async () => {
    if (!currentCustomer?.id || !currentCustomer.name) {
      toast.error("Customer ID and Name are required");
      return;
    }
    try {
      const payload = {
        ...currentCustomer,
        updatedAt: new Date().toISOString().slice(0, 19),
      };
      const response = await axios.put(API_BASE_URL, payload);
      setCustomers((prev) =>
        prev.map((item) => (item.id === currentCustomer.id ? payload : item))
      );
      toast.success(response.data?.message || "Customer updated successfully!");
      setIsUpdateOpen(false);
      setCurrentCustomer(null);
    } catch (error: any) {
      console.error("Error updating customer:", error.message, error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update customer");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCustomer((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleIntegrationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCustomer((prev) => {
      if (!prev) return null;
      const integrations = JSON.parse(prev.integrations || "{}");
      integrations[name] = value;
      return { ...prev, integrations: JSON.stringify(integrations) };
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setCurrentCustomer((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const getSortIcon = (column: string) => {
    const direction = sortDirection[column];
    if (direction === "asc") return <ArrowUp className="h-4 w-4 ml-2" />;
    if (direction === "desc") return <ArrowDown className="h-4 w-4 ml-2" />;
    return null;
  };

  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-full overflow-x-hidden p-6">
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Button onClick={openAddCustomerForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Name</span>
                    {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-2/7 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("email")}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Email</span>
                    {getSortIcon("email")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("country")}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Country</span>
                    {getSortIcon("country")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("dateAdded")}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Date Added</span>
                    {getSortIcon("dateAdded")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("integrations")}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Integrations</span>
                    {getSortIcon("integrations")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("activePlanName")}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Active Plan</span>
                    {getSortIcon("activePlanName")}
                  </Button>
                </TableHead>
                <TableHead className="px-2 py-2 hover:bg-gray-100 w-1/7 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="p-0 w-full flex items-center justify-center"
                  >
                    <span>Status</span>
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow key={item.id || index} className={`hover:bg-gray-100 ${resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">
                    {item.name}
                  </TableCell>
                  <TableCell className="px-2 py-3 w-2/7 truncate text-center">
                    {item.email || ""}
                  </TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">
                    {item.country || ""}
                  </TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">
                    {item.dateAdded || ""}
                  </TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">
                    {item.integrations || ""}
                  </TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">
                    {item.activePlanName || ""}
                  </TableCell>
                  <TableCell className="px-2 py-3 w-1/7 truncate text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => item.id && handleDelete(item.id)}
                        disabled={!item.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-white p-1 rounded"
                        onClick={() => {
                          setCurrentCustomer(item);
                          setIsUpdateOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
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

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={currentCustomer?.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={currentCustomer?.email || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Input
                id="country"
                name="country"
                value={currentCustomer?.country || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateAdded" className="text-right">
                Date Added
              </Label>
              <Input
                id="dateAdded"
                name="dateAdded"
                value={currentCustomer?.dateAdded || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="YYYY-MM-DDTHH:mm:ss"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="crm" className="text-right">
                CRM
              </Label>
              <Input
                id="crm"
                name="crm"
                value={JSON.parse(currentCustomer?.integrations || "{}").crm || ""}
                onChange={handleIntegrationsChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analytics" className="text-right">
                Analytics
              </Label>
              <Input
                id="analytics"
                name="analytics"
                value={JSON.parse(currentCustomer?.integrations || "{}").analytics || ""}
                onChange={handleIntegrationsChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activePlanName" className="text-right">
                Plan
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("activePlanName", value)}
                value={currentCustomer?.activePlanName}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("status", value)}
                value={currentCustomer?.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!currentCustomer?.name}>
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}