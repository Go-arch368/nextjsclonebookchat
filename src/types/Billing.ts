
export interface Invoice {
  id: number;
  companyName: string;
  customerEmail: string;
  createdAt: string;
  invoiceNo: string;
  price: number;
  currency: string;
  status: string;
  deletedAt: string | null;
}

export interface Payment {
  id: number;
  createdAt: string;
  updatedAt: string;
  amount: number;
  currency: string;
  status: 'Completed' | 'Cancelled' | 'Refunded';
  cancellationTime?: string | null;
  cancellationReason?: string | null;
}

export interface PricePlan {
  id: number;
  planName: string;
  planDescription: string;
  status: 'active' | 'inactive';
  defaultPlan: boolean;
  freePlan: boolean;
  type: 'public' | 'custom';
  dateAdded: string;
  priceMonthly: number;
  priceAnnually: number;
  unlimitedChat: boolean;
  numberOfChats: number;
  extraChatAmount: number;
  unlimitedChatHistoryStorage: boolean;
  chatHistoryDurationDays: number;
  costPerExtraDayOfStorage: number;
  unlimitedUsers: boolean;
  numberOfUsers: number;
  extraUserCost: number;
  numberOfWebsites: number;
  extraWebsiteCost: number;
  chatTakeover: boolean;
  chatTagging: boolean;
  chatTranscript: boolean;
  chatbotOpenaiIncluded: boolean;
  managedAccount: boolean;
  customPlan: boolean;
  createdAt: string;
  updatedAt: string;
}