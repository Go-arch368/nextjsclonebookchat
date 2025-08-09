import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/websites`
  : 'https://zotly.onrender.com/websites';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const keyword = searchParams.get('keyword');
  const page = searchParams.get('page') || '0';
  const size = searchParams.get('size') || '10';

  if (action === 'list') {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/list`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend /list responded with status ${res.status}: ${errorText}`);
        throw new Error(`Backend responded with status ${res.status}`);
      }
      const contentType = res.headers.get('content-type');
      const text = await res.text();
      let data;
      if (text && contentType?.includes('application/json')) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error(`Error parsing JSON for /list: ${text}`);
          throw new Error('Invalid JSON response from backend');
        }
      } else {
        data = []; // Fallback to empty array for list
      }
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in GET /list:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch websites' },
        { status: 500 }
      );
    }
  } else if (action === 'search' && keyword) {
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend /search responded with status ${res.status}: ${errorText}`);
        throw new Error(`Backend responded with status ${res.status}`);
      }
      const contentType = res.headers.get('content-type');
      const text = await res.text();
      let data;
      if (text && contentType?.includes('application/json')) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error(`Error parsing JSON for /search: ${text}`);
          throw new Error('Invalid JSON response from backend');
        }
      } else {
        data = []; // Fallback to empty array for search
      }
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in GET /search:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to search websites' },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: 'Invalid action or missing keyword' },
      { status: 400 }
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
      console.error(`Backend /save responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }
    const contentType = res.headers.get('content-type');
    const text = await res.text();
    let data;
    if (text && contentType?.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error(`Error parsing JSON for /save: ${text}`);
        throw new Error('Invalid JSON response from backend');
      }
    } else {
      data = { message: 'Website added successfully', ...body };
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in POST /save:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to add website' },
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
      console.error(`Backend /update responded with status ${res.status}: ${errorText}`);
      throw new Error(`Backend responded with status ${res.status}`);
    }
    const contentType = res.headers.get('content-type');
    const text = await res.text();
    let data;
    if (text && contentType?.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error(`Error parsing JSON for /update: ${text}`);
        throw new Error('Invalid JSON response from backend');
      }
    } else {
      data = { message: 'Website updated successfully', ...body };
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in PUT /update:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update website' },
      { status: 500 }
    );
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
        data = { message: 'All websites cleared successfully' };
      }
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in DELETE /clear:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to clear websites' },
        { status: 500 }
      );
    }
  } else if (id) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
        data = { message: `Website ${id} deleted successfully` };
      }
      return NextResponse.json(data);
    } catch (error: any) {
      console.error(`Error in DELETE /delete/${id}:`, error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to delete website' },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: 'Invalid delete request: specify "action=clear" or "id=<id>"' },
      { status: 400 }
    );
  }
}