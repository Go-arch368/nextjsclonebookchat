import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/global-webhooks`
  : 'https://zotlyadminapis-39lct.ondigitalocean.app/zotlyadmin/api/v1/settings/global-webhooks';

  let memoryStorage: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');

    // Try to fetch from backend first
    let webhooks: any[] = [];
    try {
      const res = await fetch(BACKEND_BASE_URL, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        webhooks = await res.json();
        memoryStorage = webhooks; // Update memory storage
      } else {
        throw new Error(`Backend responded with status ${res.status}`);
      }
    } catch (backendError) {
      console.warn('Backend not available, using memory storage:', backendError);
      webhooks = memoryStorage;
    }

    // Handle search locally if keyword is provided
    if (keyword) {
      const searchTerm = keyword.toLowerCase();
      webhooks = webhooks.filter(webhook =>
        webhook.event?.toLowerCase().includes(searchTerm) ||
        webhook.email?.toLowerCase().includes(searchTerm) ||
        webhook.targetUrl?.toLowerCase().includes(searchTerm) ||
        webhook.createdBy?.toLowerCase().includes(searchTerm) ||
        webhook.company?.toLowerCase().includes(searchTerm)
      );
    }

    // Handle pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedWebhooks = webhooks.slice(startIndex, endIndex);

    return NextResponse.json(paginatedWebhooks);

  } catch (error: any) {
    console.error('Error in GET global webhooks:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch global webhooks' },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Remove ID if present (let backend generate it)
    const { id, ...payload } = body;
    
    console.log('Creating global webhook:', payload);

    const res = await fetch(BACKEND_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    console.log('Backend response:', responseText);

    if (!res.ok) {
      throw new Error(`Backend responded with status ${res.status}: ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({ message: responseText });
    }
  } catch (error: any) {
    console.error('Error in POST global webhook:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to create global webhook' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { message: 'Missing global webhook ID for update' },
        { status: 400 }
      );
    }

    console.log('Updating global webhook:', body);

    const res = await fetch(BACKEND_BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();
    console.log('Backend response:', responseText);

    if (!res.ok) {
      throw new Error(`Backend responded with status ${res.status}: ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({ message: responseText });
    }
  } catch (error: any) {
    console.error('Error in PUT global webhook:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to update global webhook' },
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
        { message: 'Missing global webhook ID' },
        { status: 400 }
      );
    }

    console.log('Deleting global webhook ID:', id);

    // Try different DELETE endpoint patterns
    let deleteUrl = `${BACKEND_BASE_URL}/${id}`;
    let success = false;
    
    try {
      const res = await fetch(deleteUrl, { method: 'DELETE' });
      if (res.ok) {
        success = true;
      } else {
        throw new Error(`Status ${res.status}`);
      }
    } catch (error) {
      console.log('Trying alternative DELETE format...');
      deleteUrl = `${BACKEND_BASE_URL}?id=${id}`;
      const res = await fetch(deleteUrl, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }
      success = true;
    }

    if (success) {
      return NextResponse.json(
        { message: `Global webhook ${id} deleted successfully` },
        { status: 200 }
      );
    }

  } catch (error: any) {
    console.error('Error in DELETE global webhook:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to delete global webhook' },
      { status: 500 }
    );
  }
}