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
import { Globe, Plus } from "lucide-react";
import axios from "axios";
import { Website } from "@/types/website";

interface AddWebsiteFormProps {
  onSubmit: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddWebsiteForm({ onSubmit, isOpen, setIsOpen }: AddWebsiteFormProps) {
  const [formData, setFormData] = useState<Website>({
    protocol: "HTTPS",
    domain: "",
    companyId: 0,
    businessCategory: "",
    dateAdded: "",
    isActive: false,
    isVerified: false,
    createdAt: new Date().toISOString().slice(0, 19),
    updatedAt: new Date().toISOString().slice(0, 19),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const API_BASE_URL = "/api/websites";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "companyId" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.domain || !formData.companyId || !formData.businessCategory || !formData.dateAdded) {
      setShowErrors(true);
      toast.error("Please fill all required fields");
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (!dateRegex.test(formData.dateAdded)) {
      setShowErrors(true);
      toast.error("Date Added must be in format YYYY-MM-DDTHH:mm:ss");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        createdAt: formData.createdAt || new Date().toISOString().slice(0, 19),
        updatedAt: formData.updatedAt || new Date().toISOString().slice(0, 19),
      };
      console.log("POST /save payload:", payload);
      const response = await axios.post<Website>(`${API_BASE_URL}`, payload);
      console.log("POST /save response:", response.data);
      await onSubmit();
      setFormData({
        protocol: "HTTPS",
        domain: "",
        companyId: 0,
        businessCategory: "",
        dateAdded: "",
        isActive: false,
        isVerified: false,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      setIsOpen(false);
      toast.success(
         "Website added successfully!"
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to add website";
      console.error("POST /save error:", errorMessage, error.response?.data);
      // Check for duplicate domain error
      if (errorMessage.includes("Duplicate entry") && errorMessage.includes("for key 'domain'")) {
        const domainMatch = errorMessage.match(/Duplicate entry '([^']+)' for key 'domain'/);
        const domain = domainMatch ? domainMatch[1] : formData.domain;
        toast.error(`Website with domain '${domain}' already exists`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
      setShowErrors(false);
    }
  };

  const isFieldInvalid = (field: keyof Website) => {
    if (field === "companyId") return showErrors && formData[field] === 0;
    if (field === "protocol" || field === "isActive" || field === "isVerified" || field === "createdAt" || field === "updatedAt") return false;
    return showErrors && !formData[field];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
    
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add a new website</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="protocol" className="text-blue-700 block">
              Protocol *
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("protocol", value)}
              value={formData.protocol}
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
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className={`pl-10 w-full border border-gray-300 rounded-md ${isFieldInvalid("domain") ? "border-red-500" : ""}`}
                placeholder="example.com"
              />
            </div>
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
            <Label htmlFor="businessCategory" className="text-blue-700 block">
              Business Category *
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("businessCategory", value)}
              value={formData.businessCategory}
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
              value={formData.dateAdded}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("domain") ? "border-red-500" : ""}`}
              placeholder="YYYY-MM-DDTHH:mm:ss (e.g., 2025-07-29T09:44:00)"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-blue-700 block">Status</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleCheckboxChange("isActive", e.target.checked)}
                  className="mr-2"
                />
                Active
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVerified}
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
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}