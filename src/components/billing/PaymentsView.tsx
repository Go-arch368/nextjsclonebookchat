// src/components/billing/PaymentsView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Label } from '@/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { toast } from 'sonner';
import Pagination from '../Pagination';
import PaymentsTable from './PaymentsTable';
import { Payment } from '@/types/Billing';
import { useBillingStore } from '@/stores/useBillingStore';

const STATUSES = ['Completed', 'Cancelled', 'Refunded'];
const CURRENCIES = ['USD', 'EUR', 'GBP'];

export default function PaymentsView() {
  const { payments, paymentsTotalPages, fetchPayments, createPayment, updatePayment, clearPayments, searchPayments } = useBillingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

  useEffect(() => {
    console.log('Fetching initial payments');
    fetchPayments().catch((error) => {
      console.error('Initial fetch payments error:', error);
      toast.error('Failed to load payments');
    });
  }, [fetchPayments]);

  useEffect(() => {
    const keyword = searchTerm || '';
    const page = currentPage - 1; // API expects 0-based page
    const size = itemsPerPage;
    console.log('Searching payments:', { keyword, page, size, totalPages: paymentsTotalPages });
    searchPayments(keyword, page, size).catch((error) => {
      console.error('Search payments error:', error);
      toast.error('Failed to search payments');
    });
  }, [searchTerm, currentPage, itemsPerPage, searchPayments]);

  const handleSearch = () => {
    setCurrentPage(1);
    const keyword = searchTerm || '';
    console.log('Manual search:', { keyword, page: 0, size: itemsPerPage });
    searchPayments(keyword, 0, itemsPerPage).catch((error) => {
      console.error('Manual search error:', error);
      toast.error('Failed to search payments');
    });
  };

  const handleCreate = async () => {
    if (
      !currentPayment?.amount ||
      !currentPayment.currency ||
      !currentPayment.status ||
      (currentPayment.status === 'Refunded' &&
        (!currentPayment.cancellationTime || !currentPayment.cancellationReason))
    ) {
      toast.error('All required fields must be filled');
      return;
    }
    try {
      await createPayment({
        amount: currentPayment.amount,
        currency: currentPayment.currency,
        status: currentPayment.status,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      setIsCreateOpen(false);
      setCurrentPayment(null);
      searchPayments(searchTerm || '', currentPage - 1, itemsPerPage).catch(() => toast.error('Failed to refresh payments'));
    } catch (error: any) {
      console.error('Create payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to create payment');
    }
  };

  const handleUpdate = async () => {
    if (
      !currentPayment?.id ||
      !currentPayment.amount ||
      !currentPayment.currency ||
      !currentPayment.status ||
      (currentPayment.status === 'Refunded' &&
        (!currentPayment.cancellationTime || !currentPayment.cancellationReason))
    ) {
      toast.error('All required fields must be filled');
      return;
    }
    try {
      await updatePayment({
        ...currentPayment,
        cancellationTime: currentPayment.status === 'Refunded' ? currentPayment.cancellationTime : null,
        cancellationReason: currentPayment.status === 'Refunded' ? currentPayment.cancellationReason : null,
        updatedAt: new Date().toISOString().slice(0, 19),
      });
      setIsUpdateOpen(false);
      setCurrentPayment(null);
      searchPayments(searchTerm || '', currentPage - 1, itemsPerPage).catch(() => toast.error('Failed to refresh payments'));
    } catch (error: any) {
      console.error('Update payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to update payment');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPayment((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'amount' ? (value ? parseFloat(value) : 0) : value,
          }
        : {
            id: 0,
            createdAt: new Date().toISOString().slice(0, 19),
            updatedAt: new Date().toISOString().slice(0, 19),
            amount: 0,
            currency: '',
            status: 'Completed',
            cancellationTime: null,
            cancellationReason: null,
            [name]: name === 'amount' ? (value ? parseFloat(value) : 0) : value,
          }
    );
  };

  const handleSelectChange = (name: keyof Payment, value: string) => {
    setCurrentPayment((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
            cancellationTime: value === 'Refunded' ? prev.cancellationTime || new Date().toISOString().slice(0, 19) : null,
            cancellationReason: value === 'Refunded' ? prev.cancellationReason || '' : null,
          }
        : {
            id: 0,
            createdAt: new Date().toISOString().slice(0, 19),
            updatedAt: new Date().toISOString().slice(0, 19),
            amount: 0,
            currency: '',
            status: name === 'status' && (value === 'Completed' || value === 'Cancelled' || value === 'Refunded') ? value as 'Completed' | 'Cancelled' | 'Refunded' : 'Completed',
            cancellationTime: value === 'Refunded' ? new Date().toISOString().slice(0, 19) : null,
            cancellationReason: value === 'Refunded' ? '' : null,
            [name]: value,
          }
    );
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete all payments? This action cannot be undone.')) {
      try {
        await clearPayments();
        setCurrentPage(1);
        toast.success('All payments cleared successfully!');
      } catch (error: any) {
        console.error('Clear payments error:', error);
        toast.error(error.response?.data?.message || 'Failed to clear payments');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-3xl text-center mb-3 font-bold text-gray-800 dark:text-white">Payments</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Input
            placeholder="Search by currency"
            className="w-full h-10 sm:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setCurrentPayment({
                  id: 0,
                  createdAt: new Date().toISOString().slice(0, 19),
                  updatedAt: new Date().toISOString().slice(0, 19),
                  amount: 0,
                  currency: '',
                  status: 'Completed',
                  cancellationTime: null,
                  cancellationReason: null,
                });
                setIsCreateOpen(true);
              }}
            >
              <Plus size={16} />
              Create Payment
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={handleClearAll}
              disabled={payments.length === 0}
            >
              <Trash2 size={16} />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <Card className="overflow-auto rounded-2xl shadow-sm">
          <PaymentsTable
            payments={payments}
            onEdit={(payment) => {
              setCurrentPayment(payment);
              setIsUpdateOpen(true);
            }}
          />
        </Card>
        <Pagination
          currentPage={currentPage}
          totalPages={paymentsTotalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => {
            console.log('Page changed to:', page);
            setCurrentPage(page);
          }}
          onItemsPerPageChange={(size) => {
            console.log('Items per page changed to:', size);
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open);
        if (!open) setCurrentPayment(null);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-blue-700 block">
                Amount *
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={currentPayment?.amount ?? 0}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-blue-700 block">
                Currency *
              </Label>
              <Select
                value={currentPayment?.currency || ''}
                onValueChange={(value) => handleSelectChange('currency', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-blue-700 block">
                Status *
              </Label>
              <Select
                value={currentPayment?.status || ''}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {currentPayment?.status === 'Refunded' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cancellationTime" className="text-blue-700 block">
                    Cancellation Time *
                  </Label>
                  <Input
                    id="cancellationTime"
                    name="cancellationTime"
                    type="datetime-local"
                    value={currentPayment?.cancellationTime?.slice(0, 16) || new Date().toISOString().slice(0, 16)}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationReason" className="text-blue-700 block">
                    Cancellation Reason *
                  </Label>
                  <Input
                    id="cancellationReason"
                    name="cancellationReason"
                    value={currentPayment?.cancellationReason || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md"
                    placeholder="Enter cancellation reason"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setCurrentPayment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !currentPayment?.amount ||
                !currentPayment.currency ||
                !currentPayment.status ||
                (currentPayment.status === 'Refunded' &&
                  (!currentPayment.cancellationTime || !currentPayment.cancellationReason))
              }
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateOpen} onOpenChange={(open) => {
        setIsUpdateOpen(open);
        if (!open) setCurrentPayment(null);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-blue-700 block">
                Amount *
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={currentPayment?.amount ?? 0}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-blue-700 block">
                Currency *
              </Label>
              <Select
                value={currentPayment?.currency || ''}
                onValueChange={(value) => handleSelectChange('currency', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-blue-700 block">
                Status *
              </Label>
              <Select
                value={currentPayment?.status || ''}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {currentPayment?.status === 'Refunded' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cancellationTime" className="text-blue-700 block">
                    Cancellation Time *
                  </Label>
                  <Input
                    id="cancellationTime"
                    name="cancellationTime"
                    type="datetime-local"
                    value={currentPayment?.cancellationTime?.slice(0, 16) || new Date().toISOString().slice(0, 16)}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationReason" className="text-blue-700 block">
                    Cancellation Reason *
                  </Label>
                  <Input
                    id="cancellationReason"
                    name="cancellationReason"
                    value={currentPayment?.cancellationReason || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md"
                    placeholder="Enter cancellation reason"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateOpen(false);
                setCurrentPayment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                !currentPayment?.amount ||
                !currentPayment.currency ||
                !currentPayment.status ||
                (currentPayment.status === 'Refunded' &&
                  (!currentPayment.cancellationTime || !currentPayment.cancellationReason))
              }
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}