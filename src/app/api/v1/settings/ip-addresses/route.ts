import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/ip-addresses`
  : 'https://zotly.onrender.com/api/v1/settings/ip-addresses';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';

    let url;
    if (keyword) {
      url = `${BACKEND_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    } else {
      url = `${BACKEND_BASE_URL}/all`;
    }

    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in GET IP addresses:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch IP addresses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    
    // Validate IP address format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(body.ipAddress)) {
      return NextResponse.json(
        { message: 'Please enter a valid IP address (e.g., 192.168.1.1)' },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      createdAt: now,
      updatedAt: now,
      userId: body.userId || 1, // Default user ID
    };

    const res = await fetch(`${BACKEND_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in POST IP address:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to create IP address' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    
    // Validate IP address format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(body.ipAddress)) {
      return NextResponse.json(
        { message: 'Please enter a valid IP address (e.g., 192.168.1.1)' },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      updatedAt: now,
    };

    const res = await fetch(`${BACKEND_BASE_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in PUT IP address:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update IP address' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Missing IP address ID' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }

    return NextResponse.json(
      { message: `IP address ${id} deleted successfully` },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in DELETE IP address:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to delete IP address' },
      { status: 500 }
    );
  }
}