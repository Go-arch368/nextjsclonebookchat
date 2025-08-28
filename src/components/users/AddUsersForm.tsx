"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Plus, User as UserIcon } from "lucide-react";
import axios from "axios";
import { User } from "@/types/user";

interface AddUsersFormProps {
  onSubmit: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ROLES = ["ADMIN", "MANAGER", "SUPERVISOR", "AGENT"];

export default function AddUsersForm({ onSubmit, isOpen, setIsOpen }: AddUsersFormProps) {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    email: "",
    role: "",
    passwordHash: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    department: "",
    companyId: 0,
    simultaneousChatLimit: 0,
    createdAt: new Date().toISOString().slice(0, 19),
    updatedAt: new Date().toISOString().slice(0, 19),
    deletedAt: null,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const API_BASE_URL = `/api/users`; // Use Next.js API route

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "A valid email address is required";
    }
    if (!formData.role) {
      errors.role = "Role is required";
    }
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.companyId) {
      errors.companyId = "Company ID is required";
    }
    if (!formData.simultaneousChatLimit) {
      errors.simultaneousChatLimit = "Chat limit is required";
    }
    if (!formData.passwordHash) {
      errors.passwordHash = "Password is required";
    } else if (formData.passwordHash.length < 8) {
      errors.passwordHash = "Password must be at least 8 characters long";
    }
    if (formData.passwordHash !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setShowErrors(true);
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Omit<User, 'id'> = {
        email: formData.email,
        role: formData.role,
        passwordHash: formData.passwordHash,
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle || "",
        department: formData.department || "",
        companyId: formData.companyId,
        simultaneousChatLimit: formData.simultaneousChatLimit,
        createdAt: formData.createdAt || new Date().toISOString().slice(0, 19),
        updatedAt: formData.updatedAt || new Date().toISOString().slice(0, 19),
        deletedAt: formData.deletedAt,
      };

      console.log("POST /save payload:", payload);

      const response = await axios.post<User>(`${API_BASE_URL}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log("POST /save response:", response.data);

      await onSubmit();

      setFormData({
        email: "",
        role: "",
        passwordHash: "",
        firstName: "",
        lastName: "",
        jobTitle: "",
        department: "",
        companyId: 0,
        simultaneousChatLimit: 0,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
        deletedAt: null,
      });
      setConfirmPassword("");
      setIsOpen(false);
      toast.success("User added successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to add user";
      console.error("POST /save error:", errorMessage, error.response?.data);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setShowErrors(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "companyId" || name === "simultaneousChatLimit" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const isFieldInvalid = (field: keyof Omit<User, 'id'> | "confirmPassword") => {
    if (field === "confirmPassword") return showErrors && formData.passwordHash !== confirmPassword;
    if (field === "jobTitle" || field === "department" || field === "createdAt" || field === "updatedAt" || field === "deletedAt") return false;
    if (field === "companyId" || field === "simultaneousChatLimit") return showErrors && formData[field] === 0;
    if (field === "email") return showErrors && (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
    if (field === "passwordHash") return showErrors && (!formData.passwordHash || formData.passwordHash.length < 8);
    return showErrors && !formData[field];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="hidden">Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a new user</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-700 block">
                Email *
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 w-full border border-gray-300 rounded-md ${isFieldInvalid("email") ? "border-red-500" : ""}`}
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-blue-700 block">
                Role *
              </Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.role}
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
                Password *
              </Label>
              <Input
                id="passwordHash"
                name="passwordHash"
                type="password"
                value={formData.passwordHash}
                onChange={handleInputChange}
                className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("passwordHash") ? "border-red-500" : ""}`}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-700 block">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("confirmPassword") ? "border-red-500" : ""}`}
                placeholder="Confirm password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-blue-700 block">
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
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
                value={formData.lastName}
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
                value={formData.jobTitle}
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
                value={formData.department}
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
                value={formData.companyId || ""}
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
                value={formData.simultaneousChatLimit || ""}
                onChange={handleInputChange}
                className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("simultaneousChatLimit") ? "border-red-500" : ""}`}
                placeholder="Enter chat limit"
              />
            </div>
            <div className="flex justify-end gap-2 sticky bottom-0 bg-white pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? "Adding..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}