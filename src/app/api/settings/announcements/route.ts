// route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'https://zotly.onrender.com';

async function handleBackendRequest(
  endpoint: string,
  method: string,
  request?: NextRequest,
  extraHeaders: Record<string, string> = {}
) {
  try {
    const url = `${BACKEND_BASE_URL}/settings/announcements/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    let body;
    if (request && ['POST', 'PUT'].includes(method)) {
      body = await request.json();
      // Ensure createdAt and updatedAt are included if not provided
      if (!body.createdAt) body.createdAt = new Date().toISOString();
      if (!body.updatedAt) body.updatedAt = new Date().toISOString();
    }

    const backendResponse = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`/backend${endpoint} responded with status ${backendResponse.status}: ${errorText}`);
    }

    const contentType = backendResponse.headers.get('content-type');
    const text = await backendResponse.text();
    let data;
    if (text && contentType?.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error(`Error parsing JSON for ${endpoint}: ${text}`);
        throw new Error('Invalid JSON response from backend');
      }
    } else {
      data = endpoint === 'list' ? [] : { message: `Request to ${endpoint} successful` };
    }

    return data;
  } catch (error: any) {
    console.error(`Backend request failed for ${endpoint}: ${error.message}`);
    throw error;
  }
}

export async function GET() {
  try {
    const data = await handleBackendRequest('list', 'GET');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await handleBackendRequest('save', 'POST', request);
    return NextResponse.json({ message: 'Announcement added successfully', ...data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await handleBackendRequest('update', 'PUT', request);
    return NextResponse.json({ message: 'Announcement updated successfully', ...data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing announcement ID' },
      { status: 400 }
    );
  }

  try {
    const data = await handleBackendRequest(`delete/${id}`, 'DELETE');
    return NextResponse.json({ message: `Announcement ${id} deleted successfully`, ...data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}