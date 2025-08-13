// src/app/api/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/customers`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  
  if (action === 'list') {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/list`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend /list responded with status ${res.status}: ${errorText}`);
        throw new Error(`Backend responded with status ${res.status}`);
      }
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in GET /list:', error.message, error.stack);
      return NextResponse.json({ message: error.message || 'Failed to fetch customers' }, { status: 500 });
    }
  } else if (action === 'search') {
    const keyword = searchParams.get('keyword') || '';
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend /search responded with status ${res.status}: ${errorText}`);
        throw new Error(`Backend responded with status ${res.status}`);
      }
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in GET /search:', error.message, error.stack);
      return NextResponse.json({ message: error.message || 'Failed to search customers' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend /save responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in POST /save:', error.message, error.stack);
    return NextResponse.json({ message: error.message || 'Failed to add customer' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_BASE_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend /update responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in PUT /update:', error.message, error.stack);
    return NextResponse.json({ message: error.message || 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');

  if (action === 'clear') {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend /clear responded with status ${res.status}: ${errorText}`);
        throw new Error(`Backend responded with status ${res.status}`);
      }
      const contentType = res.headers.get('content-type');
      const text = await res.text();
      let data;
      if (text && contentType?.includes('application/json')) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error(`Error parsing JSON for /clear: ${text}`);
          throw new Error('Invalid JSON response from backend');
        }
      } else {
        data = { message: 'Customers cleared successfully' };
      }
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in DELETE /clear:', error.message, error.stack);
      return NextResponse.json({ message: error.message || 'Failed to clear customers' }, { status: 500 });
    }
  } else if (id) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend /delete/${id} responded with status ${res.status}: ${errorText}`);
        throw new Error(`Backend responded with status ${res.status}`);
      }
      const contentType = res.headers.get('content-type');
      const text = await res.text();
      let data;
      if (text && contentType?.includes('application/json')) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error(`Error parsing JSON for /delete/${id}: ${text}`);
          throw new Error('Invalid JSON response from backend');
        }
      } else {
        // Fallback for empty or non-JSON response
        data = { message: `Customer ${id} deleted successfully` };
      }
      return NextResponse.json(data);
    } catch (error: any) {
      console.error(`Error in DELETE /delete/${id}:`, error.message, error.stack);
      return NextResponse.json({ message: error.message || 'Failed to delete customer' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Invalid delete request: specify "action=clear" or "id=<id>"' }, { status: 400 });
  }
}