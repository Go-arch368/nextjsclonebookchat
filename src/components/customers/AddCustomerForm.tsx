// src/components/AddCustomerForm.tsx
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
import { Plus, Lock, Mail, MapPin, Link, Star,Calendar1Icon} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface CustomerFormData {
  name?: string;
  email?: string;
  country?: string;
  date?: string;
  integrations?: string;
  plan?: string;
}

interface AddCustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
}

export default function AddCustomerForm({ onSubmit }: AddCustomerFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    country: "",
    date: "",
    integrations: "",
    plan: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, plan: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      date: date ? format(date, "dd/MM/yyyy HH:mm") : "",
    }));
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add customer");
      }

      toast.success("Customer added successfully!");
      onSubmit(formData);
      setFormData({
        name: "",
        email: "",
        country: "",
        date: "",
        integrations: "",
        plan: "",
      });
      setSelectedDate(undefined);
      setIsConfirmOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
            {/* Name Field */}
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
                />
              </div>
            </div>

            {/* Email Field */}
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

            {/* Country Field */}
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

            {/* Date Field (Date Picker) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar1Icon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Pick a date</span>}
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

            {/* Integrations Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="integrations" className="text-right">
                Integrations
              </Label>
              <div className="relative col-span-3">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="integrations"
                  name="integrations"
                  value={formData.integrations}
                  onChange={handleInputChange}
                  className="pl-9"
                  placeholder="Enter integrations"
                />
              </div>
            </div>

            {/* Plan Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plan
              </Label>
              <div className="col-span-3">
                <Select onValueChange={handleSelectChange} value={formData.plan}>
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
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={isSubmitting}>
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
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
              <span className="col-span-3">{formData.name || "N/A"}</span>
              <span className="text-right font-medium">Email:</span>
              <span className="col-span-3">{formData.email || "N/A"}</span>
              <span className="text-right font-medium">Country:</span>
              <span className="col-span-3">{formData.country || "N/A"}</span>
              <span className="text-right font-medium">Date:</span>
              <span className="col-span-3">{formData.date || "N/A"}</span>
              <span className="text-right font-medium">Integrations:</span>
              <span className="col-span-3">{formData.integrations || "N/A"}</span>
              <span className="text-right font-medium">Plan:</span>
              <span className="col-span-3">{formData.plan || "N/A"}</span>
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