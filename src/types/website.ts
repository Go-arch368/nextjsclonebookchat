// types/website.ts
export interface Website {
  id?: number;
  protocol: string;
  domain: string;
  companyId: number;
  businessCategory: string;
  dateAdded: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}