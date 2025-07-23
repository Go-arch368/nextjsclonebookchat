// src/components/AddWebsiteForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { Globe,Plus } from "lucide-react";

interface WebsiteFormData {
  protocol?: string;
  domain?: string;
  company?: string;
  category?: string;
}

interface AddWebsiteFormProps {
  onSubmit: (data: WebsiteFormData) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddWebsiteForm: React.FC<AddWebsiteFormProps> = ({ onSubmit, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState<WebsiteFormData>({
    protocol: "HTTPS",
    domain: "",
    company: "",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.domain || !formData.company || !formData.category) {
      setShowErrors(true);
      return;
    }
    setIsSubmitting(true);
    try {
      toast.success("Website added successfully!");
      onSubmit(formData);
      setFormData({ protocol: "HTTPS", domain: "", company: "", category: "" });
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
      setShowErrors(false);
    }
  };

  const isFieldInvalid = (field: keyof WebsiteFormData) => {
    return showErrors && !formData[field] && field !== "protocol";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
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
              // className="w-full"
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
            <Label htmlFor="company" className="text-blue-700 block">
              Company *
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("company", value)}
              value={formData.company}
              // className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("company") ? "border-red-500" : ""}`}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CDP Resolution">CDP Resolution</SelectItem>
                <SelectItem value="CISCO">CISCO</SelectItem>
                <SelectItem value="Chat Metrics">Chat Metrics</SelectItem>
                <SelectItem value="Chat Metrics Client Test">Chat Metrics Client Test</SelectItem>
                <SelectItem value="Chat Metrics Tester">Chat Metrics Tester</SelectItem>
                <SelectItem value="Chatmetrics test account #2">Chatmetrics test account #2</SelectItem>
                <SelectItem value="Delivr">Delivr</SelectItem>
                <SelectItem value="Dev test">Dev test</SelectItem>
                <SelectItem value="Fox">Fox</SelectItem>
                <SelectItem value="Nicram It Solutions">Nicram It Solutions</SelectItem>
                <SelectItem value="NicramFaust">NicramFaust</SelectItem>
                <SelectItem value="Oxnia">Oxnia</SelectItem>
                <SelectItem value="TW Test - Training Sanghamitra">TW Test - Training Sanghamitra</SelectItem>
                <SelectItem value="Test company">Test company</SelectItem>
                <SelectItem value="Test customer">Test customer</SelectItem>
                <SelectItem value="Treative">Treative</SelectItem>
                <SelectItem value="ZOTLY">ZOTLY</SelectItem>
                <SelectItem value="Zotly">Zotly</SelectItem>
                <SelectItem value="chatmetrics">chatmetrics</SelectItem>
                <SelectItem value="faust-it">faust-it</SelectItem>
                <SelectItem value="swastechnolgies pvt ltd">swastechnolgies pvt ltd</SelectItem>
                <SelectItem value="test company xyz">test company xyz</SelectItem>
                <SelectItem value="test.com">test.com</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-blue-700 block">
              Business Category *
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("category", value)}
              value={formData.category}
              // className={`w-full border border-gray-300 rounded-md ${isFieldInvalid("category") ? "border-red-500" : ""}`}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                <SelectItem value="Saas">Saas</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
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

export default AddWebsiteForm;