import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/integrations`
  : 'https://zotly.onrender.com/api/v1/settings/integrations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');
    
    let url;
    if (keyword) {
      const page = searchParams.get('page') || '0';
      const size = searchParams.get('size') || '10';
      url = `${BACKEND_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    } else {
      url = `${BACKEND_BASE_URL}`;
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
    console.error('Error in GET integrations:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();

    // Validate required fields
    if (!body.service || !['ZAPIER', 'DRIFT'].includes(body.service)) {
      return NextResponse.json(
        { message: 'Please select a valid service (ZAPIER or DRIFT)' },
        { status: 400 }
      );
    }

    const payload = {
      userId: 1,
      service: body.service,
      website: body.website,
      apiKey: body.apiKey,
      isConfigured: body.isConfigured || false,
      createdAt: now,
      updatedAt: now
    };

    const res = await fetch(BACKEND_BASE_URL, {
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
    console.error('Error in POST integration:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to create integration' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { message: 'Integration ID is required for update' },
        { status: 400 }
      );
    }

    const payload = {
      id: body.id,
      userId: body.userId || 1,
      service: body.service,
      website: body.website,
      apiKey: body.apiKey,
      isConfigured: body.isConfigured || false,
      createdAt: body.createdAt || now, // Include createdAt from existing data or use current time
      updatedAt: now
    };

    const res = await fetch(BACKEND_BASE_URL, {
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
    console.error('Error in PUT integration:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update integration' },
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
        { message: 'Missing integration ID' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }

    return NextResponse.json(
      { message: `Integration ${id} deleted successfully` },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in DELETE integration:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to delete integration' },
      { status: 500 }
    );
  }
}