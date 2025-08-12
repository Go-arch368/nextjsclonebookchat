// app/api/v1/settings/mail-templates/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/mail-templates`
  : 'https://your-backend-url.com/api/v1/settings/mail-templates';

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
      url = `${BACKEND_BASE_URL}/all?page=${page}&size=${size}`;
    }

    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Backend responded with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in GET mail templates:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch mail templates' },
      { status: 500 }
    );
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
      throw new Error(`Backend responded with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in POST mail template:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create mail template' },
      { status: 500 }
    );
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
      throw new Error(`Backend responded with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in PUT mail template:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update mail template' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (action === 'clear') {
      const res = await fetch(`${BACKEND_BASE_URL}/delete/all`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend responded with status ${res.status}: ${errorText}`);
      }
      
      return NextResponse.json(
        { message: 'All mail templates cleared successfully' },
        { status: 200 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { message: 'Missing mail template ID' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Backend responded with status ${res.status}: ${errorText}`);
    }

    return NextResponse.json(
      { message: 'Mail template deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in DELETE mail template:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete mail template' },
      { status: 500 }
    );
  }
}