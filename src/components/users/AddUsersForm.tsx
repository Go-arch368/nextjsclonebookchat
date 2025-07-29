// src/components/users/AddUsersForm.tsx
"use client";

import React, { useState } from 'react';
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
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { User } from '@/types/user';

interface AddUsersFormProps {
  onSubmit: (data: User) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ROLES = ["ADMIN", "MANAGER", "SUPERVISOR", "AGENT"];

const AddUsersForm: React.FC<AddUsersFormProps> = ({ onSubmit, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState<User>({
    email: "",
    role: "",
    passwordHash: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    department: "",
    companyId: 0,
    simultaneousChatLimit: 0,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "companyId" || name === "simultaneousChatLimit" ? (value ? parseInt(value) : 0) : value,
      }));
    }
  };

  const handleSelectChange = (name: keyof User, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const requiredFields: (keyof User)[] = ["email", "role", "passwordHash", "firstName", "lastName", "companyId", "simultaneousChatLimit"];
    if (requiredFields.some(field => !formData[field] && formData[field] !== 0)) {
      setShowErrors(true);
      toast.error("All required fields must be filled");
      return;
    }
    if (formData.passwordHash !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsSubmitting(true);
    try {
      onSubmit(formData);
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
      });
      setConfirmPassword("");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
      setShowErrors(false);
    }
  };

  const isFieldInvalid = (field: keyof User) => {
    return showErrors && (!formData[field] && formData[field] !== 0) && ["email", "role", "passwordHash", "firstName", "lastName", "companyId", "simultaneousChatLimit"].includes(field);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a new user</DialogTitle>
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
              value={formData.email || ""}
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
              value={formData.role || ""}
              onValueChange={(value) => handleSelectChange("role", value)}
            >
              <SelectTrigger className={`w-full ${isFieldInvalid("role") ? "border-red-500" : ""}`}>
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
              value={formData.passwordHash || ""}
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
              value={confirmPassword || ""}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded-md ${showErrors && !confirmPassword ? "border-red-500" : ""}`}
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
              value={formData.firstName || ""}
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
              value={formData.lastName || ""}
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
              value={formData.jobTitle || ""}
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
              value={formData.department || ""}
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
              value={formData.companyId ?? 0}
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
              value={formData.simultaneousChatLimit ?? 0}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("simultaneousChatLimit") ? "border-red-500" : ""}`}
              placeholder="Enter limit"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
            setIsOpen(false);
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
            });
            setConfirmPassword("");
          }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsersForm;