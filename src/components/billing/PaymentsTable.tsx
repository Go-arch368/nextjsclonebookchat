// src/components/billing/PaymentsTable.tsx
'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Button } from '@/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Payment } from '@/types/Billing';
import { useBillingStore } from '@/stores/useBillingStore';
import { toast } from 'sonner';

interface PaymentsTableProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
}

export default function PaymentsTable({ payments, onEdit }: PaymentsTableProps) {
  const { deletePayment } = useBillingStore();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment(id);
        toast.success('Payment deleted successfully!');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete payment');
      }
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Cancellation Time</TableHead>
          <TableHead>Cancellation Reason</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length > 0 ? (
          payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {payment.updatedAt
                  ? new Date(payment.updatedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </TableCell>
              <TableCell>${payment.amount.toFixed(2)}</TableCell>
              <TableCell>{payment.currency || 'N/A'}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    payment.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : payment.status === 'Refunded'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {payment.status || 'Unknown'}
                </span>
              </TableCell>
              <TableCell>
                {payment.status === 'Refunded' && payment.cancellationTime
                  ? new Date(payment.cancellationTime).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'}
              </TableCell>
              <TableCell>
                {payment.status === 'Refunded' && payment.cancellationReason
                  ? payment.cancellationReason
                  : '-'}
              </TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button variant="ghost" onClick={() => onEdit(payment)}>
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => payment.id && handleDelete(payment.id)}
                    disabled={!payment.id}
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
              No payments found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}