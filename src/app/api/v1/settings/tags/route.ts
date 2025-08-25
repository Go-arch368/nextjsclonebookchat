import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/tags`
  : 'https://zotly.onrender.com/api/v1/settings/tags';

// Helper function to handle all fetch requests
async function fetchFromBackend(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Backend responded with status ${res.status}: ${errorText}`);
    throw new Error(`Backend responded with status ${res.status}: ${errorText}`);
  }

  // For DELETE requests, the backend might return empty response
  if (options.method === 'DELETE') {
    return null;
  }

  return res.json();
}

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
      url = BACKEND_BASE_URL;
    }

    const data = await fetchFromBackend(url);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in GET tags:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Add required fields according to schema
    const payload = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('POST payload to backend:', payload);

    const data = await fetchFromBackend(BACKEND_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in POST tag:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to create tag' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // For PUT requests, we need to get the existing tag first to preserve createdAt
    // Let's fetch the existing tag to get the createdAt value
    let existingTag = null;
    try {
      const existingResponse = await fetch(`${BACKEND_BASE_URL}/${body.id}`);
      if (existingResponse.ok) {
        existingTag = await existingResponse.json();
      }
    } catch (error) {
      console.warn('Could not fetch existing tag, using current timestamp for createdAt');
    }

    // Prepare payload with required fields
    const payload = {
      ...body,
      createdAt: existingTag?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('PUT payload to backend:', payload);

    const data = await fetchFromBackend(BACKEND_BASE_URL, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in PUT tag:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to update tag' },
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
        { message: 'Missing tag ID' },
        { status: 400 }
      );
    }

    // Try with path parameter format first (most common for Spring Boot)
    // api/v1/settings/tags/1
    let deleteUrl = `${BACKEND_BASE_URL}/${id}`;
    let success = false;
    
    try {
      await fetchFromBackend(deleteUrl, {
        method: 'DELETE',
      });
      success = true;
    } catch (error) {
      console.log('Trying alternative DELETE URL format with query parameter...');
      // If that fails, try with query parameter format
      // api/v1/settings/tags?id=1
      deleteUrl = `${BACKEND_BASE_URL}?id=${id}`;
      try {
        await fetchFromBackend(deleteUrl, {
          method: 'DELETE',
        });
        success = true;
      } catch (secondError) {
        console.error('Both DELETE formats failed:', secondError);
        throw new Error('Failed to delete tag with both URL formats');
      }
    }

    if (success) {
      return NextResponse.json(
        { message: `Tag ${id} deleted successfully` },
        { status: 200 }
      );
    }

  } catch (error: any) {
    console.error('Error in DELETE tag:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to delete tag' },
      { status: 500 }
    );
  }
}