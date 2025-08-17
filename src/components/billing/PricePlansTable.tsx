// src/components/billing/PricePlansTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Pencil, Trash2, Plus, Trash } from 'lucide-react';
import Pagination from '../Pagination';
import CreatePlanForm from './PlanForm';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/ui/dialog';
import { useBillingStore } from '@/stores/useBillingStore';
import { PricePlan } from '@/types/Billing';

export default function PricePlansTable() {
  const {
    pricePlans,
    pricePlansTotalPages,
    fetchPricePlans,
    searchPricePlans,
    deletePricePlan,
    clearPricePlans,
  } = useBillingStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [editPlan, setEditPlan] = useState<PricePlan | null>(null);

  useEffect(() => {
    if (searchTerm) {
      searchPricePlans(searchTerm, currentPage - 1, itemsPerPage);
    } else {
      fetchPricePlans();
    }
  }, [currentPage, itemsPerPage, searchTerm, fetchPricePlans, searchPricePlans]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this price plan?')) {
      try {
        await deletePricePlan(id);
      } catch (error) {
        console.error('Failed to delete price plan:', error);
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all price plans? This action cannot be undone.')) {
      try {
        await clearPricePlans();
      } catch (error) {
        console.error('Failed to clear price plans:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-center mb-3 text-2xl font-semibold text-gray-800 dark:text-white">
          Price Plans
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Input
            placeholder="Search price plans..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-64"
          />
          <div className="flex gap-2">
            <Button
  variant="destructive"
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md bg-red-600 hover:bg-red-700 text-white whitespace-nowrap"
  onClick={handleClearAll}
  disabled={pricePlans.length === 0}
>
  <Trash2 className="w-4 h-4" />
  <span>Clear All Plans</span>
</Button>
            <Dialog>
              <DialogTrigger asChild>
               <Button 
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
>
  <Plus className="w-4 h-4" />
  <span>Add Price Plan</span>
</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-center">Create a New Price Plan</DialogTitle>
                  <DialogDescription className="text-center">
                    Fill out the fields to define a new subscription plan.
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[70vh] pr-2">
                  <CreatePlanForm onClose={() => {}} isEdit={false} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <Card className="overflow-auto rounded-2xl shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default Plan</TableHead>
                <TableHead>Free Plan</TableHead>
                <TableHead>Price (Monthly)</TableHead>
                <TableHead>Price (Annually)</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricePlans.length > 0 ? (
                pricePlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.planName}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          plan.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </TableCell>
                    <TableCell>{plan.defaultPlan ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{plan.freePlan ? 'Yes' : 'No'}</TableCell>
                    <TableCell>${plan.priceMonthly.toFixed(2)}</TableCell>
                    <TableCell>${plan.priceAnnually.toFixed(2)}</TableCell>
                    <TableCell>{new Date(plan.dateAdded).toLocaleDateString()}</TableCell>
                    <TableCell>{plan.type}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditPlan(plan)}
                          >
                            <Pencil size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-center">Edit Price Plan</DialogTitle>
                            <DialogDescription className="text-center">
                              Update the fields to modify the subscription plan.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="overflow-y-auto max-h-[70vh] pr-2">
                            <CreatePlanForm
                              plan={editPlan ?? undefined}
                              isEdit={true}
                              onClose={() => setEditPlan(null)}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-100"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500">
                    No plans found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
        <Pagination
          currentPage={currentPage}
          totalPages={pricePlansTotalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}