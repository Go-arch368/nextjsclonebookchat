// src/app/api/customers/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Customer from '@/lib/Customer';

export async function GET() {
  try {
    await dbConnect();
    const customers = await Customer.find();
    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const customer = new Customer(body);
    await customer.save();
    return NextResponse.json({ message: 'Customer added successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}