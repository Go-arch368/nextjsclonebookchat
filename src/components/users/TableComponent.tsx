// src/components/users/TableComponent.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import { Edit, Trash2, CircleUser } from "lucide-react";
import { Skeleton } from "@/ui/skeleton";
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
import axios from "axios";
import { User } from '@/types/user';

interface TableComponentProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const ROLES = ["ADMIN", "MANAGER", "SUPERVISOR", "AGENT"];

const TableComponent: React.FC<TableComponentProps> = ({ users, setUsers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passwordHash, setPasswordHash] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const API_BASE_URL = "https://zotly.onrender.com/users";
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/list`);
        console.log("GET /list response:", response.data);
        setUsers(response.data || []);
      } catch (error: any) {
        console.error("Error fetching users:", error.message);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [setUsers]);

  

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      setUsers((prev) => {
        const newData = prev.filter((user) => user.id !== id);
        if (newData.length <= (currentPage - 1) * itemsPerPage) {
          setCurrentPage((prev) => Math.max(1, prev - 1));
        }
        return newData;
      });
      toast.success("User deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete user";
      console.error("Delete error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async () => {
    if (!currentUser?.id || !currentUser.email || !currentUser.role || !currentUser.firstName || !currentUser.lastName || !currentUser.companyId || !currentUser.simultaneousChatLimit) {
      toast.error("All required fields must be filled");
      return;
    }
    if (passwordHash && passwordHash !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const payload = {
        ...currentUser,
        updatedAt: new Date().toISOString().slice(0, 19),
        passwordHash: passwordHash || currentUser.passwordHash, // Use existing passwordHash if no new password
      };
      console.log("PUT /update payload:", payload);
      const response = await axios.put(`${API_BASE_URL}/update`, payload);
      console.log("PUT /update response:", response.data);
      setUsers((prev) =>
        prev.map((user) => (user.id === currentUser.id ? { ...payload, passwordHash: undefined } : user))
      );
      toast.success("User updated successfully!");
      setIsUpdateOpen(false);
      setCurrentUser(null);
      setPasswordHash("");
      setConfirmPassword("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update user";
      console.error("Update error:", errorMessage, error.response?.data);
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "passwordHash") {
      setPasswordHash(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              [name]: name === "companyId" || name === "simultaneousChatLimit" ? (value ? parseInt(value) : 0) : value,
            }
          : {
              id: 0,
              email: "",
              role: "",
              firstName: "",
              lastName: "",
              jobTitle: "",
              department: "",
              companyId: 0,
              simultaneousChatLimit: 0,
              createdAt: new Date().toISOString().slice(0, 19),
              updatedAt: new Date().toISOString().slice(0, 19),
              deletedAt: null,
              [name]: name === "companyId" || name === "simultaneousChatLimit" ? (value ? parseInt(value) : 0) : value,
            }
      );
    }
  };

  const handleSelectChange = (name: keyof User, value: string) => {
    setCurrentUser((prev) =>
      prev
        ? { ...prev, [name]: value }
        : {
            id: 0,
            email: "",
            role: name === "role" ? value : "",
            firstName: "",
            lastName: "",
            jobTitle: "",
            department: "",
            companyId: 0,
            simultaneousChatLimit: 0,
            createdAt: new Date().toISOString().slice(0, 19),
            updatedAt: new Date().toISOString().slice(0, 19),
            deletedAt: null,
          }
    );
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-full overflow-x-auto p-6">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="grid grid-cols-8 gap-2">
              {[...Array(8)].map((__, colIdx) => (
                <Skeleton key={colIdx} className="h-10 w-full rounded" />
              ))}
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No users available</p>
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
                <TableHead className="text-center">Company ID</TableHead>
                <TableHead className="text-center">Date Added</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="py-4 text-center flex items-center justify-center">
                    <CircleUser size={18} className="mr-2" />
                    {user.firstName || "N/A"}
                  </TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.lastName || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.role || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.email || ""}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.jobTitle || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.department || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.companyId || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">{user.createdAt || "N/A"}</TableCell>
                  <TableCell className="px-2 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCurrentUser(user);
                          setIsUpdateOpen(true);
                          setPasswordHash("");
                          setConfirmPassword("");
                        }}
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => user.id && handleDelete(user.id)}
                        disabled={!user.id}
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

      {currentUser && (
        <Dialog open={isUpdateOpen} onOpenChange={(open) => {
          setIsUpdateOpen(open);
          if (!open) {
            setCurrentUser(null);
            setPasswordHash("");
            setConfirmPassword("");
          }
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-700 block">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={currentUser.email || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-blue-700 block">
                  Role *
                </Label>
                <Select
                  value={currentUser.role || ""}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordHash" className="text-blue-700 block">
                  Password (optional)
                </Label>
                <Input
                  id="passwordHash"
                  name="passwordHash"
                  type="password"
                  value={passwordHash || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-blue-700 block">
                  Confirm Password (optional)
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-blue-700 block">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={currentUser.firstName || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-blue-700 block">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={currentUser.lastName || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-blue-700 block">
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={currentUser.jobTitle || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter job title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-blue-700 block">
                  Department
                </Label>
                <Input
                  id="department"
                  name="department"
                  value={currentUser.department || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter department"
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
                  value={currentUser.companyId ?? 0}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter company ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="simultaneousChatLimit" className="text-blue-700 block">
                  Simultaneous Chat Limit *
                </Label>
                <Input
                  id="simultaneousChatLimit"
                  name="simultaneousChatLimit"
                  type="number"
                  value={currentUser.simultaneousChatLimit ?? 0}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md"
                  placeholder="Enter limit"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUpdateOpen(false);
                  setCurrentUser(null);
                  setPasswordHash("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={!currentUser.email}>
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TableComponent;