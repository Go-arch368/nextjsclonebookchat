// components/customers/AddCustomerForm.tsx
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover";
import { Calendar } from "@/ui/calendar";
import { Plus, Lock, Mail, MapPin, Link, Star, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { Customer } from "@/types/customer";

interface AddCustomerFormProps {
  onSubmit: (data: Customer) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddCustomerForm({ onSubmit, isOpen, setIsOpen }: AddCustomerFormProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<Customer>({
    name: "",
    email: "",
    country: "",
    dateAdded: "",
    integrations: JSON.stringify({ crm: "", analytics: "" }),
    activePlanName: "",
    status: "active",
    createdAt: new Date().toISOString().slice(0, 19),
    updatedAt: new Date().toISOString().slice(0, 19),
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = "https://zotly.onrender.com/customers";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIntegrationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const integrations = JSON.parse(prev.integrations || "{}");
      integrations[name] = value;
      return { ...prev, integrations: JSON.stringify(integrations) };
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      dateAdded: date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : "",
    }));
  };

  const handleFormSubmit = () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    setIsOpen(false);
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        createdAt: formData.createdAt || new Date().toISOString().slice(0, 19),
        updatedAt: formData.updatedAt || new Date().toISOString().slice(0, 19),
      };
      await axios.post(`${API_BASE_URL}/save`, payload);
      toast.success("Customer added successfully!");
      onSubmit(payload);
      setFormData({
        name: "",
        email: "",
        country: "",
        dateAdded: "",
        integrations: JSON.stringify({ crm: "", analytics: "" }),
        activePlanName: "",
        status: "active",
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      setSelectedDate(undefined);
      setIsConfirmOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a new customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="relative col-span-3">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="Enter name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="relative col-span-3">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <div className="relative col-span-3">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="Enter country"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateAdded" className="text-right">
                Date Added
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "yyyy-MM-dd") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="crm" className="text-right">
                CRM
              </Label>
              <div className="relative col-span-3">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="crm"
                  name="crm"
                  value={JSON.parse(formData.integrations || "{}").crm || ""}
                  onChange={handleIntegrationsChange}
                  className="pl-9"
                  placeholder="Enter CRM integration"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analytics" className="text-right">
                Analytics
              </Label>
              <div className="relative col-span-3">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="analytics"
                  name="analytics"
                  value={JSON.parse(formData.integrations || "{}").analytics || ""}
                  onChange={handleIntegrationsChange}
                  className="pl-9"
                  placeholder="Enter analytics integration"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activePlanName" className="text-right">
                Plan
              </Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => handleSelectChange("activePlanName", value)} value={formData.activePlanName}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => handleSelectChange("status", value)} value={formData.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={isSubmitting}>
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Customer Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <p className="text-sm">Please confirm the customer details:</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <span className="text-right font-medium">Name:</span>
              <span className="col-span-3">{formData.name}</span>
              <span className="text-right font-medium">Email:</span>
              <span className="col-span-3">{formData.email || "N/A"}</span>
              <span className="text-right font-medium">Country:</span>
              <span className="col-span-3">{formData.country || "N/A"}</span>
              <span className="text-right font-medium">Date Added:</span>
              <span className="col-span-3">{formData.dateAdded || "N/A"}</span>
              <span className="text-right font-medium">Integrations:</span>
              <span className="col-span-3">{formData.integrations || "N/A"}</span>
              <span className="text-right font-medium">Plan:</span>
              <span className="col-span-3">{formData.activePlanName || "N/A"}</span>
              <span className="text-right font-medium">Status:</span>
              <span className="col-span-3">{formData.status || "N/A"}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}