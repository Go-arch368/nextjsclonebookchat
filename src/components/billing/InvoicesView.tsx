// src/components/billing/InvoicesView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/ui/command';
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
import InvoicesTable from './InvoicesTable';
import { DateRangePicker } from './DateRangePicker';
import { Invoice } from '@/types/Billing';
import { useBillingStore } from '@/stores/useBillingStore';

const STATUSES = ['Pending', 'Paid'] // Update based on Postman
const CURRENCIES = ['USD', 'EUR', 'GBP']; // Update based on Postman

export default function InvoicesView() {
  const { invoices, fetchInvoices, createInvoice, updateInvoice, clearInvoices } = useBillingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [companyQuery, setCompanyQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // Fetch invoices on mount
  useEffect(() => {
    fetchInvoices().catch(() => toast.error('Failed to load invoices'));
  }, [fetchInvoices]);

  // Extract unique company names
  const companyNames = Array.from(new Set(invoices.map((inv) => inv.companyName)));

  // Filter logic
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesCompany =
      companyFilter === 'all' || companyFilter === ''
        ? true
        : invoice.companyName === companyFilter;

    const matchesSearch =
      invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());

    const invoiceDate = new Date(invoice.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const matchesDate = (!from || invoiceDate >= from) && (!to || invoiceDate <= to);

    return matchesCompany && matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, companyFilter, fromDate, toDate, itemsPerPage]);

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchInvoices().catch(() => toast.error('Failed to load invoices'));
      return;
    }
    try {
      await useBillingStore.getState().searchInvoices(searchTerm, 0, itemsPerPage);
    } catch (error: any) {
      toast.error(error.message || 'Failed to search invoices');
    }
  };

  const handleCreate = async () => {
    if (
      !currentInvoice?.companyName ||
      !currentInvoice.customerEmail ||
      !currentInvoice.invoiceNo ||
      !currentInvoice.price ||
      !currentInvoice.currency ||
      !currentInvoice.status
    ) {
      toast.error('All required fields must be filled');
      return;
    }
    try {
      await createInvoice({
        companyName: currentInvoice.companyName,
        customerEmail: currentInvoice.customerEmail,
        invoiceNo: currentInvoice.invoiceNo,
        price: currentInvoice.price,
        currency: currentInvoice.currency,
        status: currentInvoice.status,
        createdAt: new Date().toISOString().slice(0, 19),
      });
      toast.success('Invoice created successfully!');
      setIsCreateOpen(false);
      setCurrentInvoice(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create invoice');
    }
  };

  const handleUpdate = async () => {
    if (
      !currentInvoice?.id ||
      !currentInvoice.companyName ||
      !currentInvoice.customerEmail ||
      !currentInvoice.invoiceNo ||
      !currentInvoice.price ||
      !currentInvoice.currency ||
      !currentInvoice.status
    ) {
      toast.error('All required fields must be filled');
      return;
    }
    try {
      await updateInvoice(currentInvoice);
      toast.success('Invoice updated successfully!');
      setIsUpdateOpen(false);
      setCurrentInvoice(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update invoice');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentInvoice((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'price' ? (value ? parseFloat(value) : 0) : value,
          }
        : {
            id: 0,
            companyName: '',
            customerEmail: '',
            createdAt: new Date().toISOString().slice(0, 19),
            invoiceNo: '',
            price: 0,
            currency: '',
            status: '',
            deletedAt: null,
            [name]: name === 'price' ? (value ? parseFloat(value) : 0) : value,
          }
    );
  };

  const handleSelectChange = (name: keyof Invoice, value: string) => {
    setCurrentInvoice((prev) =>
      prev
        ? { ...prev, [name]: value }
        : {
            id: 0,
            companyName: '',
            customerEmail: '',
            createdAt: new Date().toISOString().slice(0, 19),
            invoiceNo: '',
            price: 0,
            currency: '',
            status: '',
            deletedAt: null,
            [name]: value,
          }
    );
  };

  const handleClearAll = async () => {
    try {
      await clearInvoices();
      toast.success('All invoices cleared successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear invoices');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <h1 className=" text-center mb-3 text-2xl font-semibold text-gray-800 dark:text-white">Invoices</h1>

        {/* Search + Generate + Clear All */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Input
            placeholder="Search by email or invoice no..."
            className="w-full h-10 sm:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="flex gap-2">
         {/* Generate Invoice Button */}
<Button
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
  onClick={() => {
    setCurrentInvoice({
      id: 0,
      companyName: '',
      customerEmail: '',
      createdAt: new Date().toISOString().slice(0, 19),
      invoiceNo: '',
      price: 0,
      currency: '',
      status: '',
      deletedAt: null,
    });
    setIsCreateOpen(true);
  }}
>
  <Plus className="w-4 h-4" />
  <span>Generate Invoice</span>
</Button>

{/* Clear All Button */}
<Button
  variant="destructive"
  className="flex items-center gap-2 px-3 py-1.5 border text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
  onClick={handleClearAll}
>
  <Trash2 className="w-4 h-4" />
  <span>Clear All</span>
</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col mt-4 sm:flex-row gap-4 items-start justify-between sm:items-end relative z-10">
          <div className="w-full sm:w-80 relative">
            <Command className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CommandInput
                placeholder="Search company..."
                className="h-10 px-3 text-sm"
                value={companyQuery}
                onValueChange={(val) => setCompanyQuery(val)}
              />
              {companyQuery.length > 0 && (
                <div className="absolute top-full mt-1 w-full z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <CommandList className="max-h-60 overflow-y-auto">
                    <CommandEmpty className="p-2 text-sm text-gray-500">
                      No company found.
                    </CommandEmpty>
                    <CommandItem
                      onSelect={() => {
                        setCompanyFilter('all');
                        setCompanyQuery('');
                      }}
                      className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      All
                    </CommandItem>
                    {companyNames
                      .filter((name) => name.toLowerCase().includes(companyQuery.toLowerCase()))
                      .map((name) => (
                        <CommandItem
                          key={name}
                          onSelect={() => {
                            setCompanyFilter(name);
                            setCompanyQuery('');
                          }}
                          className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {name}
                        </CommandItem>
                      ))}
                  </CommandList>
                </div>
              )}
            </Command>
          </div>

          <DateRangePicker
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <Card className="overflow-auto rounded-2xl shadow-sm">
          <InvoicesTable
            invoices={paginatedInvoices}
            onEdit={(invoice) => {
              setCurrentInvoice(invoice);
              setIsUpdateOpen(true);
            }}
          />
        </Card>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open);
        if (!open) setCurrentInvoice(null);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-blue-700 block">
                Company Name *
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={currentInvoice?.companyName || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-blue-700 block">
                Customer Email *
              </Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={currentInvoice?.customerEmail || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter customer email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceNo" className="text-blue-700 block">
                Invoice No *
              </Label>
              <Input
                id="invoiceNo"
                name="invoiceNo"
                value={currentInvoice?.invoiceNo || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter invoice number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-blue-700 block">
                Price *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={currentInvoice?.price ?? 0}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-blue-700 block">
                Currency *
              </Label>
              <Select
                value={currentInvoice?.currency || ''}
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
                value={currentInvoice?.status || ''}
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
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setCurrentInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !currentInvoice?.companyName ||
                !currentInvoice.customerEmail ||
                !currentInvoice.invoiceNo ||
                !currentInvoice.price ||
                !currentInvoice.currency ||
                !currentInvoice.status
              }
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Invoice Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={(open) => {
        setIsUpdateOpen(open);
        if (!open) setCurrentInvoice(null);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Invoice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-blue-700 block">
                Company Name *
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={currentInvoice?.companyName || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-blue-700 block">
                Customer Email *
              </Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={currentInvoice?.customerEmail || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter customer email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceNo" className="text-blue-700 block">
                Invoice No *
              </Label>
              <Input
                id="invoiceNo"
                name="invoiceNo"
                value={currentInvoice?.invoiceNo || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter invoice number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-blue-700 block">
                Price *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={currentInvoice?.price ?? 0}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-blue-700 block">
                Currency *
              </Label>
              <Select
                value={currentInvoice?.currency || ''}
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
                value={currentInvoice?.status || ''}
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
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateOpen(false);
                setCurrentInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                !currentInvoice?.companyName ||
                !currentInvoice.customerEmail ||
                !currentInvoice.invoiceNo ||
                !currentInvoice.price ||
                !currentInvoice.currency ||
                !currentInvoice.status
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