// src/stores/useBillingStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { Invoice, Payment, PricePlan } from '@/types/Billing';
import { toast } from 'sonner';

interface BillingStore {
  invoices: Invoice[];
  payments: Payment[];
  pricePlans: PricePlan[];
  totalPages: number;
  paymentsTotalPages: number;
  pricePlansTotalPages: number;
  setInvoices: (invoices: Invoice[], totalPages?: number) => void;
  setPayments: (payments: Payment[], totalPages?: number) => void;
  setPricePlans: (pricePlans: PricePlan[], totalPages?: number) => void;
  fetchInvoices: () => Promise<void>;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'deletedAt'>) => Promise<void>;
  updateInvoice: (invoice: Invoice) => Promise<void>;
  deleteInvoice: (id: number) => Promise<void>;
  clearInvoices: () => Promise<void>;
  searchInvoices: (keyword: string, page: number, size: number) => Promise<void>;
  fetchPayments: () => Promise<void>;
  createPayment: (payment: Omit<Payment, 'id' | 'cancellationTime' | 'cancellationReason'>) => Promise<void>;
  updatePayment: (payment: Payment) => Promise<void>;
  deletePayment: (id: number) => Promise<void>;
  clearPayments: () => Promise<void>;
  searchPayments: (keyword: string, page: number, size: number) => Promise<void>;
  fetchPricePlans: () => Promise<void>;
  getPricePlan: (id: number) => Promise<void>;
  createPricePlan: (pricePlan: Omit<PricePlan, 'id' | 'createdAt' | 'updatedAt' | 'dateAdded'>) => Promise<void>;
  updatePricePlan: (pricePlan: PricePlan) => Promise<void>;
  deletePricePlan: (id: number) => Promise<void>;
  clearPricePlans: () => Promise<void>;
  searchPricePlans: (keyword: string, page: number, size: number) => Promise<void>;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}`

export const useBillingStore = create<BillingStore>((set, get) => ({
  invoices: [],
  payments: [],
  pricePlans: [],
  totalPages: 1,
  paymentsTotalPages: 1,
  pricePlansTotalPages: 1,
  setInvoices: (invoices, totalPages = 1) => set({ invoices, totalPages }),
  setPayments: (payments, totalPages = 1) => set({ payments, paymentsTotalPages: totalPages }),
  setPricePlans: (pricePlans, totalPages = 1) => set({ pricePlans, pricePlansTotalPages: totalPages }),
  fetchInvoices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices/list`);
      set({ invoices: response.data || [], totalPages: 1 });
    } catch (error: any) {
      console.error('Fetch invoices error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to load invoices');
      throw error;
    }
  },
  createInvoice: async (invoice) => {
    try {
      const payload = {
        ...invoice,
        createdAt: new Date().toISOString().slice(0, 19),
        deletedAt: null,
      };
      const response = await axios.post(`${API_BASE_URL}/invoices/save`, payload);
      set((state) => ({ invoices: [...state.invoices, response.data] }));
      toast.success('Invoice created successfully!');
    } catch (error: any) {
      console.error('Create invoice error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to create invoice');
      throw error;
    }
  },
  updateInvoice: async (invoice) => {
    try {
      const payload = {
        ...invoice,
        updatedAt: new Date().toISOString().slice(0, 19),
      };
      const response = await axios.put(`${API_BASE_URL}/invoices/update`, payload);
      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv.id === invoice.id ? response.data : inv
        ),
      }));
      toast.success('Invoice updated successfully!');
    } catch (error: any) {
      console.error('Update invoice error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update invoice');
      throw error;
    }
  },
  deleteInvoice: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/invoices/delete/${id}`);
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id),
      }));
      toast.success('Invoice deleted successfully!');
    } catch (error: any) {
      console.error('Delete invoice error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete invoice');
      throw error;
    }
  },
  clearInvoices: async () => {
    try {
      await axios.delete(`${API_BASE_URL}/invoices/clear`);
      set({ invoices: [], totalPages: 1 });
      toast.success('All invoices cleared successfully!');
    } catch (error: any) {
      console.error('Clear invoices error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to clear invoices');
      throw error;
    }
  },
  searchInvoices: async (keyword, page, size) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/invoices/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
      );
      const invoices = Array.isArray(response.data) ? response.data : response.data.content || [];
      const totalPages = response.data.totalPages || Math.ceil((response.data.totalElements || invoices.length) / size) || 1;
      set({ invoices, totalPages });
    } catch (error: any) {
      console.error('Search invoices error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to search invoices');
      throw error;
    }
  },
  fetchPayments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/list`);
      const payments = Array.isArray(response.data) ? response.data : response.data.content || [];
      const totalPages = response.data.totalPages || Math.ceil((response.data.totalElements || payments.length) / 10) || 1;
      set({ payments, paymentsTotalPages: totalPages });
    } catch (error: any) {
      console.error('Fetch payments error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to load payments');
      throw error;
    }
  },
  createPayment: async (payment) => {
    try {
      const payload = {
        ...payment,
        cancellationTime: null,
        cancellationReason: null,
      };
      const response = await axios.post(`${API_BASE_URL}/payments/save`, payload);
      set((state) => ({ payments: [...state.payments, response.data] }));
      toast.success('Payment created successfully!');
    } catch (error: any) {
      console.error('Create payment error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to create payment');
      throw error;
    }
  },
  updatePayment: async (payment) => {
    try {
      const payload = {
        ...payment,
        updatedAt: new Date().toISOString().slice(0, 19),
      };
      const response = await axios.put(`${API_BASE_URL}/payments/update`, payload);
      set((state) => ({
        payments: state.payments.map((p) =>
          p.id === payment.id ? response.data : p
        ),
      }));
      toast.success('Payment updated successfully!');
    } catch (error: any) {
      console.error('Update payment error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update payment');
      throw error;
    }
  },
  deletePayment: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/payments/delete/${id}`);
      set((state) => ({
        payments: state.payments.filter((p) => p.id !== id),
      }));
      toast.success('Payment deleted successfully!');
    } catch (error: any) {
      console.error('Delete payment error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete payment');
      throw error;
    }
  },
  clearPayments: async () => {
    try {
      await axios.delete(`${API_BASE_URL}/payments/clear`);
      set({ payments: [], paymentsTotalPages: 1 });
      toast.success('All payments cleared successfully!');
    } catch (error: any) {
      console.error('Clear payments error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to clear payments');
      throw error;
    }
  },
  searchPayments: async (keyword, page, size) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payments/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
      );
      const payments = Array.isArray(response.data) ? response.data : response.data.content || [];
      const totalPages = response.data.totalPages || Math.ceil((response.data.totalElements || payments.length) / size) || 1;
      set({ payments, paymentsTotalPages: totalPages });
    } catch (error: any) {
      console.error('Search payments error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to search payments');
      throw error;
    }
  },
  fetchPricePlans: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/price_plans/list`);
      const pricePlans = Array.isArray(response.data) ? response.data : response.data.content || [];
      const totalPages = response.data.totalPages || Math.ceil((response.data.totalElements || pricePlans.length) / 10) || 1;
      set({ pricePlans, pricePlansTotalPages: totalPages });
    } catch (error: any) {
      console.error('Fetch price plans error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to load price plans');
      throw error;
    }
  },
  getPricePlan: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/price_plans/get/${id}`);
      set((state) => ({
        pricePlans: state.pricePlans.map((p) => (p.id === id ? response.data : p)),
      }));
    } catch (error: any) {
      console.error('Get price plan error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to get price plan');
      throw error;
    }
  },
  createPricePlan: async (pricePlan) => {
    try {
      const payload = {
        ...pricePlan,
        createdAt: new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
        dateAdded: new Date().toISOString().slice(0, 19),
      };
      const response = await axios.post(`${API_BASE_URL}/price_plans/save`, payload);
      set((state) => ({ pricePlans: [...state.pricePlans, response.data] }));
      toast.success('Price plan created successfully!');
    } catch (error: any) {
      console.error('Create price plan error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to create price plan');
      throw error;
    }
  },
  updatePricePlan: async (pricePlan) => {
    try {
      const existingPlan = get().pricePlans.find((p) => p.id === pricePlan.id);
      const payload = {
        ...pricePlan,
        createdAt: pricePlan.createdAt || existingPlan?.createdAt || new Date().toISOString().slice(0, 19),
        dateAdded: pricePlan.dateAdded || existingPlan?.dateAdded || new Date().toISOString().slice(0, 19),
        updatedAt: new Date().toISOString().slice(0, 19),
      };
      const response = await axios.put(`${API_BASE_URL}/price_plans/update`, payload);
      set((state) => ({
        pricePlans: state.pricePlans.map((p) => (p.id === pricePlan.id ? response.data : p)),
      }));
      toast.success('Price plan updated successfully!');
    } catch (error: any) {
      console.error('Update price plan error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update price plan');
      throw error;
    }
  },
  deletePricePlan: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/price_plans/delete/${id}`);
      set((state) => ({
        pricePlans: state.pricePlans.filter((p) => p.id !== id),
      }));
      toast.success('Price plan deleted successfully!');
    } catch (error: any) {
      console.error('Delete price plan error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete price plan');
      throw error;
    }
  },
  clearPricePlans: async () => {
    try {
      await axios.delete(`${API_BASE_URL}/price_plans/clear`);
      set({ pricePlans: [], pricePlansTotalPages: 1 });
      toast.success('All price plans cleared successfully!');
    } catch (error: any) {
      console.error('Clear price plans error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to clear price plans');
      throw error;
    }
  },
  searchPricePlans: async (keyword, page, size) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/price_plans/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
      );
      const pricePlans = Array.isArray(response.data) ? response.data : response.data.content || [];
      const totalPages = response.data.totalPages || Math.ceil((response.data.totalElements || pricePlans.length) / size) || 1;
      set({ pricePlans, pricePlansTotalPages: totalPages });
    } catch (error: any) {
      console.error('Search price plans error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to search price plans');
      throw error;
    }
  },
}));