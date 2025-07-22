// src/app/api/customers/[email]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Customer from '@/lib/Customer';
export async function DELETE(request: NextRequest, { params }: { params: { email: string } }) {
  try {
    await dbConnect();
    const customer = await Customer.findOneAndDelete({ email: params.email });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Customer deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}