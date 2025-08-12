import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/webhooks`
  : 'https://your-backend-url.com/api/v1/settings/webhooks';

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

    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Backend responded with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error in GET webhooks:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received webhook data:', JSON.stringify(body, null, 2));

    const res = await fetch(`${BACKEND_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Backend responded with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Full error in POST webhook:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create webhook' },
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
    console.error('Error in PUT webhook:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update webhook' },
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
        { message: 'Missing webhook ID' },
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
      { message: 'Webhook deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error in DELETE webhook:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}