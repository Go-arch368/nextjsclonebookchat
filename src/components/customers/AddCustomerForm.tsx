'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Button } from '@/ui/button';
import { Plus, Lock, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function AddCustomerForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    region: '',
    postalCode: '',
    street: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setIsFormOpen(false);
    setFormData({ name: '', country: '', region: '', postalCode: '', street: '' });
  };

  return (
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

          {/* Name Field with Lock Icon */}
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
              />
            </div>
          </div>

          {/* Region Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right">
              Region
            </Label>
            <div className="relative col-span-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="pl-9"
              />
            </div>
          </div>

          {/* Postal Code Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postalCode" className="text-right">
              Postal Code
            </Label>
            <div className="relative col-span-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="pl-9"
              />
            </div>
          </div>

          {/* Street Field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="street" className="text-right">
              Street
            </Label>
            <div className="relative col-span-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsFormOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
