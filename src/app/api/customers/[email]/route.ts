// src/app/api/customers/[email]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Customer from "@/lib/Customer";

export async function DELETE(request: Request, context: { params: Promise<{ email: string }> }) {
  try {
    await dbConnect();
    const { email } = await context.params; // Await params to resolve email
    const result = await Customer.deleteOne({ email });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}