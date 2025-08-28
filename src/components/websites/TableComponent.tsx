"use client";

import { useState, useEffect } from "react";
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
import { Edit, Trash2, Check, X } from "lucide-react";
import { Skeleton } from "@/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import axios from "axios";
import { Website } from "@/types/website";
import { useTheme } from "next-themes";
interface TableComponentProps {
  websites: Website[];
  setWebsites: React.Dispatch<React.SetStateAction<Website[]>>;
}

export default function TableComponent({ websites, setWebsites }: TableComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);
 const { resolvedTheme } = useTheme();
  const API_BASE_URL = "/api/websites";
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = websites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(websites.length / itemsPerPage);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await axios.get<Website[]>(`${API_BASE_URL}?action=list`);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Expected an array');
        }
        setWebsites(response.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to load websites";
        console.error("Error fetching websites:", errorMessage, error.response?.data);
        toast.error(errorMessage);
        setWebsites([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWebsites();
  }, [setWebsites]);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}?id=${id}`);
      setWebsites((prev) => {
        const newData = prev.filter((item) => item.id !== id);
        if (newData.length <= (currentPage - 1) * itemsPerPage && currentPage > 1) {
          setCurrentPage((prev) => Math.max(1, prev - 1));
        }
        return newData;
      });
      toast.success(response.data?.message || "Website deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete website";
      console.error("Delete error:", errorMessage, error.response?.data);
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async () => {
    if (!currentWebsite?.id || !currentWebsite.domain || !currentWebsite.companyId || !currentWebsite.businessCategory || !currentWebsite.dateAdded) {
      toast.error("All required fields must be filled");
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (!dateRegex.test(currentWebsite.dateAdded)) {
      toast.error("Date Added must be in format YYYY-MM-DDTHH:mm:ss");
      return;
    }
    try {
      const payload = {
        ...currentWebsite,
        updatedAt: new Date().toISOString().slice(0, 19),
      };
      console.log("PUT /update payload:", payload);
      const response = await axios.put<Website>(`${API_BASE_URL}`, payload);
      setWebsites((prev) =>
        prev.map((item) => (item.id === currentWebsite.id ? { ...response.data } : item))
      );
      toast.success(
        "Website updated successfully!"
      );
      setIsUpdateOpen(false);
      setCurrentWebsite(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update website";
      console.error("Update error:", errorMessage, error.response?.data);
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentWebsite((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "companyId" ? parseInt(value) || 0 : value,
          }
        : null
    );
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentWebsite((prev) =>
      prev
        ? { ...prev, [name]: value }
        : null
    );
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentWebsite((prev) =>
      prev
        ? { ...prev, [name]: checked }
        : null
    );
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-full overflow-x-auto p-6">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((__, colIdx) => (
                <Skeleton key={colIdx} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ))}
        </div>
      ) : websites.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No websites available</p>
        </div>
      ) : (
        <>
          <Table className="border border-gray-200 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 py-4 w-2/5 text-center">Domain</TableHead>
                <TableHead className="px-2 py-4 w-1/5 text-center">Company ID</TableHead>
                <TableHead className="px-2 py-4 w-1/5 text-center">Date Added</TableHead>
                <TableHead className="px-2 py-4 w-1/5 text-center">Active / Verified</TableHead>
                <TableHead className="px-2 py-4 w-1/5 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id} className={`hover:bg-gray-50 ${resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <TableCell className="px-2 py-5 w-2/5 truncate text-center">
                    {`${item.protocol.toLowerCase()}://${item.domain}`}
                  </TableCell>
                  <TableCell className="px-2 py-5 w-1/5 truncate text-center">
                    {item.companyId}
                  </TableCell>
                  <TableCell className="px-2 py-5 w-1/5 truncate text-center">
                    {item.dateAdded}
                  </TableCell>
                  <TableCell className="px-2 py-5 w-1/5 text-center">
                    <span className="flex justify-center gap-2">
                      {item.isActive ? (
                        <Check className="text-green-700" size={16} />
                      ) : (
                        <X className="text-red-700" size={16} />
                      )}
                      {item.isVerified ? (
                        <Check className="text-green-700" size={16} />
                      ) : (
                        <X className="text-red-700" size={16} />
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-5 w-1/5 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCurrentWebsite(item);
                          setIsUpdateOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => item.id && handleDelete(item.id)}
                        disabled={!item.id}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
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

      {currentWebsite && (
        <Dialog open={isUpdateOpen} onOpenChange={(open) => {
          setIsUpdateOpen(open);
          if (!open) setCurrentWebsite(null);
        }}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Update Website</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="protocol" className="text-blue-700 block">
                  Protocol *
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("protocol", value)}
                  value={currentWebsite.protocol || "HTTPS"}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-md">
                    <SelectValue placeholder="Select Protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HTTPS">HTTPS</SelectItem>
                    <SelectItem value="HTTP">HTTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-blue-700 block">
                  Domain *
                </Label>
                <Input
                  id="domain"
                  name="domain"
                  value={currentWebsite.domain || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyId" className="text-blue-700 block">
                  Company ID *
                </Label>
                <Input
                  id="companyId"
                  name="companyId"
                  type="number"
                  value={currentWebsite.companyId ?? 0}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter company ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessCategory" className="text-blue-700 block">
                  Business Category *
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("businessCategory", value)}
                  value={currentWebsite.businessCategory || ""}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-md">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                    <SelectItem value="Saas">Saas</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateAdded" className="text-blue-700 block">
                  Date Added *
                </Label>
                <Input
                  id="dateAdded"
                  name="dateAdded"
                  value={currentWebsite.dateAdded || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="YYYY-MM-DDTHH:mm:ss (e.g., 2025-07-29T09:44:00)"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-blue-700 block">Status</Label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentWebsite.isActive ?? false}
                      onChange={(e) => handleCheckboxChange("isActive", e.target.checked)}
                      className="mr-2"
                    />
                    Active
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentWebsite.isVerified ?? false}
                      onChange={(e) => handleCheckboxChange("isVerified", e.target.checked)}
                      className="mr-2"
                    />
                    Verified
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUpdateOpen(false);
                  setCurrentWebsite(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={!currentWebsite.domain}>
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}