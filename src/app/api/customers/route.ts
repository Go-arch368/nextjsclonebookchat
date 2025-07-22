// src/app/api/customers/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Customer from '@/lib/Customer';

await dbConnect();

export async function GET() {
  try {
    const customers = await Customer.find();
    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}