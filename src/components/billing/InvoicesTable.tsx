// src/components/billing/InvoicesTable.tsx
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Invoice } from '@/types/Billing';
import { useBillingStore } from '@/stores/useBillingStore';
import { toast } from 'sonner';

interface InvoicesTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
}

export default function InvoicesTable({ invoices, onEdit }: InvoicesTableProps) {
  const { deleteInvoice } = useBillingStore();

  const getEmailDomain = (email: string) => {
    return email.split('@')[1] || email;
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id);
      toast.success('Invoice deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoice');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Customer Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Invoice No</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.companyName || 'N/A'}</TableCell>
              <TableCell>{invoice.customerEmail || ''}</TableCell>
              <TableCell>{invoice.createdAt || 'N/A'}</TableCell>
              <TableCell>{invoice.invoiceNo || 'N/A'}</TableCell>
              <TableCell>${invoice.price.toFixed(2)}</TableCell>
              <TableCell>{invoice.currency || 'N/A'}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : invoice.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {invoice.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(invoice)}
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => invoice.id && handleDelete(invoice.id)}
                    disabled={!invoice.id}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-gray-500">
              No invoices found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}