import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/smart-responses`
  :  `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/smart-responses`

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';

    let url;
    if (keyword) {
      // Try search endpoint if keyword provided
      url = `${BACKEND_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    } else {
      // Try the base endpoint instead of /all
      url = `${BACKEND_BASE_URL}?page=${page}&size=${size}`;
    }

    console.log('Fetching from:', url); // Add logging

    const res = await fetch(url, { 
      headers: { 'Content-Type': 'application/json' } 
    });
    
    const responseText = await res.text();
    console.log('GET response status:', res.status);
    console.log('GET response text:', responseText);

    if (!res.ok) {
      throw new Error(`Backend responded with status ${res.status}: ${responseText}`);
    }

    // Parse response
    const data = JSON.parse(responseText);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in GET smart responses:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch smart responses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Sending to backend:', `${BACKEND_BASE_URL}/save`);
    console.log('Request body:', JSON.stringify(body, null, 2));

    const res = await fetch(`${BACKEND_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();
    console.log('Backend response status:', res.status);
    console.log('Backend response text:', responseText);

    if (!res.ok) {
      // Try to parse as JSON, but fallback to text
      let errorMessage = responseText;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || responseText;
      } catch (e) {
        // Not JSON, use text as is
      }
      
      throw new Error(`Backend responded with status ${res.status}: ${errorMessage}`);
    }

    // Try to parse successful response as JSON
    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({ message: responseText });
    }

  } catch (error: any) {
    console.error('Error in POST smart response:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to create smart response' },
      { status: 500 }
    );
  }
}



export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_BASE_URL}/update`, {  // Changed from /put to /update
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
    console.error('Error in PUT smart response:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update smart response' },
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
        { message: 'All smart responses cleared successfully' },
        { status: 200 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { message: 'Missing smart response ID' },
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
      { message: 'Smart response deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in DELETE smart response:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete smart response' },
      { status: 500 }
    );
  }
}