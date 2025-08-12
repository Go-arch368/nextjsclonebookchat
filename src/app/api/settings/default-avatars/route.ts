// app/api/settings/default-avatars/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL =  process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/settings/default-avatars`
  : 'https://zotly.onrender.com/settings/default-avatars';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  try {
    // Handle different GET actions
    if (searchParams.has('id')) {
      // Get single avatar
      const id = searchParams.get('id');
      const response = await fetch(`${BACKEND_BASE_URL}/get/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return NextResponse.json(data);
    } 
    else if (searchParams.has('keyword')) {
      // Search avatars
      const keyword = searchParams.get('keyword');
      const page = searchParams.get('page') || '0';
      const size = searchParams.get('size') || '10';
      const response = await fetch(
        `${BACKEND_BASE_URL}/search?keyword=${keyword}&page=${page}&size=${size}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const data = await response.json();
      return NextResponse.json(data);
    } 
    else {
      // List all avatars
      const response = await fetch(`${BACKEND_BASE_URL}/list`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch avatars' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received payload:', body);

    // Validate required fields
    if (!body.name || !body.avatarImageUrl) {
      return NextResponse.json(
        { error: 'Name and avatarImageUrl are required' },
        { status: 400 }
      );
    }

    // Prepare payload with timestamps
    const payload = {
      ...body,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: body.updatedAt || new Date().toISOString(),
      // Remove temporary ID if it exists
      id: body.id && body.id.startsWith('temp-') ? undefined : body.id
    };

    console.log('Sending payload to backend:', payload);

    const response = await fetch(`${BACKEND_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', {
        status: response.status,
        message: errorText,
        url: `${BACKEND_BASE_URL}/save`,
        payloadSent: payload
      });
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Full error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to save avatar',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// app/api/settings/default-avatars/route.ts
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Avatar ID is required for deletion' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    // Handle 204 No Content responses
    if (response.status === 204) {
      return NextResponse.json({ success: true });
    }

    if (!response.ok) {
      // Try to get error message, fallback to status text
      let errorText;
      try {
        errorText = await response.text();
      } catch {
        errorText = response.statusText;
      }
      throw new Error(errorText || `Deletion failed with status ${response.status}`);
    }

    // Try to parse JSON only if there's content
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 0) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Deletion failed:', {
      error: error.message,
      id,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: error.message || 'Failed to delete avatar',
        id
      },
      { status: 500 }
    );
  }
}