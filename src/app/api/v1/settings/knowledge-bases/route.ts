import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/knowledge-bases`
  : 'https://zotly.onrender.com/api/v1/settings/knowledge-bases';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';
    const id = searchParams.get('id');

    let url;
    if (action === 'search' && keyword) {
      url = `${BACKEND_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    } else if (action === 'all') {
      url = `${BACKEND_BASE_URL}/all`;
    } else {
      return NextResponse.json(
        { message: 'Invalid action parameter' },
        { status: 400 }
      );
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
    console.error('Error in GET knowledge bases:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch knowledge bases' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    if (action !== 'save') {
      return NextResponse.json(
        { message: 'Invalid action parameter' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const now = new Date().toISOString();
    
    // Validate required fields
    if (!body.questionTitle?.trim()) {
      return NextResponse.json(
        { message: 'Question/Title is required' },
        { status: 400 }
      );
    }
    if (!body.answerInformation?.trim()) {
      return NextResponse.json(
        { message: 'Answer/Information is required' },
        { status: 400 }
      );
    }
    if (!body.keywords?.trim()) {
      return NextResponse.json(
        { message: 'Keywords are required' },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      userId: body.userId || 1, // Default user ID
      createdAt: now,
      updatedAt: now,
      websites: Array.isArray(body.websites) ? body.websites : [],
    };

    const res = await fetch(`${BACKEND_BASE_URL}/save`, {
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
    console.error('Error in POST knowledge base:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to create knowledge base record' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    if (action !== 'update') {
      return NextResponse.json(
        { message: 'Invalid action parameter' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const now = new Date().toISOString();
    
    // Validate required fields
    if (!body.questionTitle?.trim()) {
      return NextResponse.json(
        { message: 'Question/Title is required' },
        { status: 400 }
      );
    }
    if (!body.answerInformation?.trim()) {
      return NextResponse.json(
        { message: 'Answer/Information is required' },
        { status: 400 }
      );
    }
    if (!body.keywords?.trim()) {
      return NextResponse.json(
        { message: 'Keywords are required' },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      updatedAt: now,
      websites: Array.isArray(body.websites) ? body.websites : [],
    };

    const res = await fetch(`${BACKEND_BASE_URL}/update`, {
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
    console.error('Error in PUT knowledge base:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update knowledge base record' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'delete' && id) {
      const res = await fetch(`${BACKEND_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend responded with status ${res.status}: ${errorText}`);
        throw new Error(`Backend responded with status ${res.status}`);
      }

      return NextResponse.json(
        { message: `Knowledge base record ${id} deleted successfully` },
        { status: 200 }
      );
    } else if (action === 'delete-all') {
      const res = await fetch(`${BACKEND_BASE_URL}/delete/all`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Backend responded with status ${res.status}: ${errorText}`);
        throw new Error(`Backend responded with status ${res.status}`);
      }

      return NextResponse.json(
        { message: 'All knowledge base records deleted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid action parameter' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error in DELETE knowledge base:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to delete knowledge base record' },
      { status: 500 }
    );
  }
}