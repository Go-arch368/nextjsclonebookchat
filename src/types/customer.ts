// types/customer.ts
export interface Customer {
  id?: number;
  name: string;
  email?: string;
  country?: string;
  dateAdded?: string;
  integrations?: string;
  activePlanName?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}