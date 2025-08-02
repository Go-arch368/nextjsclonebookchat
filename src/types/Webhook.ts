// types/Webhook.ts
export interface Webhook {
  id?: number; // Optional, as server assigns id for new webhooks
  userId: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}