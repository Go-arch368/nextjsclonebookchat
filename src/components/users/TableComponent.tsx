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
import { useTheme } from 'next-themes';
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
  const { resolvedTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [passwordHash, setPasswordHash] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const API_BASE_URL = `/api/users`; // Use Next.js API route

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);
  // console.log("Users",users)
  // localStorage.setItem("users", JSON.stringify(users));
  // const savedUsers =  JSON.parse(localStorage.getItem("users") || "[]");
  // const firstUsers = savedUsers.length>0?savedUsers[0]:null;
  // console.log(firstUsers);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(`${API_BASE_URL}?action=list`);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Expected an array');
        }
        setUsers(response.data);
        console.log("response", response.data)
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to load users";
        toast.error(errorMessage);
        console.error("Error fetching users:", errorMessage, error.response?.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [setUsers]);

  const validateUpdateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!currentUser?.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser.email)) {
      errors.email = "A valid email address is required";
    }
    if (!currentUser?.role) {
      errors.role = "Role is required";
    }
    if (!currentUser?.firstName) {
      errors.firstName = "First name is required";
    }
    if (!currentUser?.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!currentUser?.companyId) {
      errors.companyId = "Company ID is required";
    }
    if (!currentUser?.simultaneousChatLimit) {
      errors.simultaneousChatLimit = "Chat limit is required";
    }
    if (passwordHash && passwordHash !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}?id=${id}`);
      setUsers((prev) => {
        const newData = prev.filter((user) => user.id !== id);
        if (newData.length <= (currentPage - 1) * itemsPerPage && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        return newData;
      });
      toast.success(response.data.message || "User deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete user";
      toast.error(errorMessage);
      console.error("Delete error:", errorMessage, error.response?.data);
    }
  };

  const handleUpdate = async () => {
    if (!currentUser) return;
    const validationErrors = validateUpdateForm();
    if (Object.keys(validationErrors).length > 0) {
      setShowErrors(true);
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      const payload: User = {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
        passwordHash: passwordHash || currentUser.passwordHash,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        jobTitle: currentUser.jobTitle || "",
        department: currentUser.department || "",
        companyId: currentUser.companyId,
        simultaneousChatLimit: currentUser.simultaneousChatLimit,
        createdAt: currentUser.createdAt,
        updatedAt: new Date().toISOString().slice(0, 19),
        deletedAt: currentUser.deletedAt,
      };

      console.log("PUT /update payload:", payload);

      const response = await axios.put<User>(`${API_BASE_URL}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === currentUser.id
            ? { ...response.data, passwordHash: user.passwordHash }
            : user
        )
      );

      toast.success( "User updated successfully!");
      setIsUpdateOpen(false);
      setCurrentUser(null);
      setPasswordHash("");
      setConfirmPassword("");
      setShowErrors(false);
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
              [name]: name === "companyId" || name === "simultaneousChatLimit" ? parseInt(value) || 0 : value,
            }
          : null
      );
    }
  };

  const handleSelectChange = (value: string) => {
    setCurrentUser((prev) =>
      prev
        ? { ...prev, role: value }
        : null
    );
  };

  const isFieldInvalid = (field: keyof User | "confirmPassword") => {
    if (!currentUser) return false;
    if (field === "confirmPassword") return showErrors && passwordHash !== confirmPassword;
    if (field === "id" || field === "jobTitle" || field === "department" || field === "createdAt" || field === "updatedAt" || field === "deletedAt") return false;
    if (field === "companyId" || field === "simultaneousChatLimit") return showErrors && currentUser[field] === 0;
    if (field === "email") return showErrors && (!currentUser.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser.email));
    return showErrors && !currentUser[field];
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-full overflow-x-auto p-6">
      {isLoading ? (
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
                <TableRow key={user.id} className={`hover:bg-gray-50 ${resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
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
            setShowErrors(false);
          }
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Update User</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-4">
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
                    className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("email") ? "border-red-500" : ""}`}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-blue-700 block">
                    Role *
                  </Label>
                  <Select
                    value={currentUser.role || ""}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-md">
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
                    value={passwordHash}
                    onChange={handleInputChange}
                    className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("passwordHash") ? "border-red-500" : ""}`}
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
                    value={confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("confirmPassword") ? "border-red-500" : ""}`}
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
                    className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("firstName") ? "border-red-500" : ""}`}
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
                    className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("lastName") ? "border-red-500" : ""}`}
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
                    value={currentUser.companyId || 0}
                    onChange={handleInputChange}
                    className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("companyId") ? "border-red-500" : ""}`}
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
                    value={currentUser.simultaneousChatLimit || 0}
                    onChange={handleInputChange}
                    className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("simultaneousChatLimit") ? "border-red-500" : ""}`}
                    placeholder="Enter limit"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 sticky bottom-0 bg-white pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUpdateOpen(false);
                    setCurrentUser(null);
                    setPasswordHash("");
                    setConfirmPassword("");
                    setShowErrors(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={!currentUser.email}>
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TableComponent;