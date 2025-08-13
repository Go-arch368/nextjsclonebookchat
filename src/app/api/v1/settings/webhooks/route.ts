import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/webhooks`
  : 'http://localhost:80/api/v1/settings/webhooks';

interface Webhook {
  id?: number;
  userId: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ErrorResponse {
  message: string;
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/all`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData: ErrorResponse = await res.json().catch(() => ({ message: `Backend responded with status ${res.status}` }));
      throw new Error(errorData.message || 'Failed to fetch webhooks');
    }

    const data: Webhook[] = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in GET webhooks:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch webhooks';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Webhook = await req.json();

    if (!body.event || !body.targetUrl || !body.createdBy || !body.company) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payload: Webhook = {
      userId: body.userId || 1,
      event: body.event,
      dataTypes: body.dataTypes || [],
      targetUrl: body.targetUrl,
      createdBy: body.createdBy,
      company: body.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch(`${BACKEND_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData: ErrorResponse = await res.json().catch(() => ({ message: `Backend responded with status ${res.status}` }));
      throw new Error(errorData.message || 'Failed to create webhook');
    }

    const data: Webhook = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in POST webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to create webhook';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Webhook = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: 'Webhook ID is required for update' },
        { status: 400 }
      );
    }

    const payload: Webhook = {
      id: body.id,
      userId: body.userId || 1,
      event: body.event,
      dataTypes: body.dataTypes || [],
      targetUrl: body.targetUrl,
      createdBy: body.createdBy,
      company: body.company,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch(`${BACKEND_BASE_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData: ErrorResponse = await res.json().catch(() => ({ message: `Backend responded with status ${res.status}` }));
      throw new Error(errorData.message || 'Failed to update webhook');
    }

    const data: Webhook = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error in PUT webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to update webhook';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Missing webhook ID' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData: ErrorResponse = await res.json().catch(() => ({ message: `Backend responded with status ${res.status}` }));
      throw new Error(errorData.message || 'Failed to delete webhook');
    }

    return NextResponse.json(
      { message: 'Webhook deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error in DELETE webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete webhook';
    return NextResponse.json({ message }, { status: 500 });
  }
}