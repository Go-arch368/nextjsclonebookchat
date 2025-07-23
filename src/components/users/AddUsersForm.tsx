// src/components/AddUsersForm.tsx
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

interface User {
  _id?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  simultaneousChatLimit?: number;
}

interface AddUsersFormProps {
  onSubmit: (data: User) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ROLES = [
  "Administrator",
  "Manager",
  "Supervisor",
  "Agent"
];

const COMPANIES = [
  "CDP Resolution",
  "CISCO",
  "Chat Metrics",
  "Chat Metrics Client Test",
  "Chat Metrics Tester",
  "Chatmetrics test account #2",
  "Delivr",
  "Dev test",
  "Fox",
  "Nicram It Solutions",
  "NicramFaust",
  "Oxnia",
  "TW Test - Training Sanghamitra",
  "Test company",
  "Test customer",
  "Treative",
  "ZOTLY",
  "Zotly",
  "chatmetrics",
  "faust-it",
  "swastechnolgies pvt ltd",
  "test company xyz",
  "test.com"
];

const AddUsersForm: React.FC<AddUsersFormProps> = ({ onSubmit, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState<User>({
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    department: "",
    company: "",
    simultaneousChatLimit: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "simultaneousChatLimit" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSelectChange = (name: keyof User, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const requiredFields = ["email", "role", "password", "confirmPassword", "firstName", "lastName", "company", "simultaneousChatLimit"];
    if (requiredFields.some(field => !formData[field as keyof User])) {
      setShowErrors(true);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsSubmitting(true);
    try {
      onSubmit(formData);
      toast.success("User added successfully!");
      setFormData({
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        jobTitle: "",
        department: "",
        company: "",
        simultaneousChatLimit: undefined,
      });
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
      setShowErrors(false);
    }
  };

  const isFieldInvalid = (field: keyof User) => {
    return showErrors && !formData[field] && ["email", "role", "password", "confirmPassword", "firstName", "lastName", "company", "simultaneousChatLimit"].includes(field);
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
          
          {/* Role Dropdown */}
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
            <Label htmlFor="password" className="text-blue-700 block">
              Password *
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password || ""}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("password") ? "border-red-500" : ""}`}
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
              value={formData.confirmPassword || ""}
              onChange={handleInputChange}
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
          
          {/* Company Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-blue-700 block">
              Company *
            </Label>
            <Select
              value={formData.company || ""}
              onValueChange={(value) => handleSelectChange("company", value)}
            >
              <SelectTrigger className={`w-full ${isFieldInvalid("company") ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {COMPANIES.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="Enter limit"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
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