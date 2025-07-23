// src/models/Customer.ts
import { Schema, model, Document, models } from "mongoose";

interface ICustomer extends Document {
  name?: string;
  email?: string;
  country?: string;
  date?: string;
  integrations?: string;
  plan?: string;
  details?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String },
    email: { type: String, index: true },
    country: { type: String },
    date: { type: String },
    integrations: { type: String },
    plan: { type: String },
    details: { type: String },
  },
  {
    collection: "customers",
    timestamps: true,
  }
);

export default models.Customer || model<ICustomer>("Customer", customerSchema);