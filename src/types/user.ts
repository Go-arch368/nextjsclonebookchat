
export interface User {
  id: number;
  email: string;
  role: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  companyId: number;
  simultaneousChatLimit: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
