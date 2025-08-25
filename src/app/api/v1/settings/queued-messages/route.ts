import { NextRequest, NextResponse } from 'next/server';
import { useUserStore } from '@/stores/useUserStore';
  

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/queued-messages`
  : 'https://zotlyadminapis-39lct.ondigitalocean.app/zotlyadmin/api/v1/settings/queued-messages';

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
    console.error('Error in GET queued messages:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch queued messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  
  try {
    const backendUrl = BACKEND_BASE_URL;
    const body = await req.json();
    
    console.log('Forwarding to:', backendUrl);
    console.log('Request body:', body);

    // Check if this is an update (has ID) but sent as POST - convert to PUT
    if (body.id) {
      console.log('ID detected in POST request, converting to PUT');
      return await PUT(req); // Reuse the PUT handler
    }

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();
    console.log('Backend response:', responseText);

    if (!res.ok) {
      console.error(`Backend error: ${res.status} - ${responseText}`);
      return NextResponse.json(
        { message: responseText || 'Backend request failed' },
        { status: res.status }
      );
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json(
        { message: responseText },
        { status: 200 }
      );
    }

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract ID from the body but DON'T put it in the URL
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { message: 'Missing message ID for update' },
        { status: 400 }
      );
    }

    console.log('PUT request for ID:', id);
    console.log('Update data:', updateData);
    
    // Send PUT to the base URL (without ID in path)
    const res = await fetch(BACKEND_BASE_URL, {  // NO ID in URL
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body, 
      
        updatedAt: new Date().toISOString() // Ensure updatedAt is current
      }),
    });

    const responseText = await res.text();
    console.log('Backend PUT response:', responseText);

    if (!res.ok) {
      console.error(`Backend responded with status ${res.status}: ${responseText}`);
      return NextResponse.json(
        { message: responseText || `Backend responded with status ${res.status}` },
        { status: res.status }
      );
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json(
        { message: responseText },
        { status: 200 }
      );
    }

  } catch (error: any) {
    console.error('Error in PUT queued message:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update queued message' },
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
        { message: 'Missing queued message ID' },
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

    // If your backend returns the deleted message, you can return it
    // Otherwise just return a success message
    return NextResponse.json(
      { message: `Queued message ${id} deleted successfully` },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in DELETE queued message:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to delete queued message' },
      { status: 500 }
    );
  }
}