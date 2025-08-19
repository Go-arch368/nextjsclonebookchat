import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/webhooks`
  : 'https://zotlyadminapis-39lct.ondigitalocean.app/zotlyadmin/api/v1/settings/webhooks';

interface Webhook {
  id?: number;
  userId: number;
  event: string;
  dataTypes: string[];
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ErrorResponse {
  message: string;
}

// In-memory storage as fallback (remove when backend GET is implemented)
let memoryStorage: Webhook[] = [];

export async function GET(req: NextRequest) {
  try {
    // Try to fetch from backend first
    try {
      const res = await fetch(BACKEND_BASE_URL, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data: Webhook[] = await res.json();
        // Update memory storage with backend data
        memoryStorage = data;
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn('Backend GET not available, using memory storage:', backendError);
    }

    // Fallback to memory storage
    console.log('Returning webhooks from memory storage:', memoryStorage);
    return NextResponse.json(memoryStorage);

  } catch (error: unknown) {
    console.error('Error in GET webhooks:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch webhooks';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Webhook = await req.json();

    if (!body.event || !body.targetUrl || !body.createdBy || !body.company) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payload: Webhook = {
      userId: body.userId || 1,
      event: body.event,
      dataTypes: body.dataTypes || [],
      targetUrl: body.targetUrl,
      createdBy: body.createdBy,
      company: body.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating webhook:', payload);

    // Try to save to backend
    let savedWebhook: Webhook;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        savedWebhook = await res.json();
      } else {
        throw new Error(`Backend responded with status ${res.status}`);
      }
    } catch (backendError) {
      console.warn('Backend POST failed, using memory storage:', backendError);
      // Create in memory storage
      savedWebhook = {
        ...payload,
        id: Date.now(), // Generate unique ID
      };
    }

    // Add to memory storage
    memoryStorage = [...memoryStorage, savedWebhook];
    console.log('Webhook saved to memory:', savedWebhook);

    return NextResponse.json(savedWebhook);

  } catch (error: unknown) {
    console.error('Error in POST webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to create webhook';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Webhook = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { message: 'Webhook ID is required for update' },
        { status: 400 }
      );
    }

    const payload: Webhook = {
      id: body.id,
      userId: body.userId || 1,
      event: body.event,
      dataTypes: body.dataTypes || [],
      targetUrl: body.targetUrl,
      createdBy: body.createdBy,
      company: body.company,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Updating webhook:', payload);

    // Try to update in backend
    let updatedWebhook: Webhook;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        updatedWebhook = await res.json();
      } else {
        throw new Error(`Backend responded with status ${res.status}`);
      }
    } catch (backendError) {
      console.warn('Backend PUT failed, using memory storage:', backendError);
      // Update in memory storage
      updatedWebhook = payload;
    }

    // Update memory storage
    memoryStorage = memoryStorage.map(wh => 
      wh.id === updatedWebhook.id ? updatedWebhook : wh
    );

    return NextResponse.json(updatedWebhook);

  } catch (error: unknown) {
    console.error('Error in PUT webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to update webhook';
    return NextResponse.json({ message }, { status: 500 });
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

    const idNum = parseInt(id);

    console.log('Deleting webhook ID:', idNum);

    // Try to delete from backend
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/delete/${idNum}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Backend responded with status ${res.status}`);
      }
    } catch (backendError) {
      console.warn('Backend DELETE failed, using memory storage:', backendError);
    }

    // Remove from memory storage
    memoryStorage = memoryStorage.filter(wh => wh.id !== idNum);

    return NextResponse.json(
      { message: 'Webhook deleted successfully' },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Error in DELETE webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete webhook';
    return NextResponse.json({ message }, { status: 500 });
  }
}