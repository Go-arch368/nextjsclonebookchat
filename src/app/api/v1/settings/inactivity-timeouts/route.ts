import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/inactivity-timeouts`
  : 'https://zotly.onrender.com/api/v1/settings/inactivity-timeouts';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to fetch inactivity timeouts');
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch inactivity timeouts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.timeoutMessage) {
      return NextResponse.json(
        { message: 'Timeout message is required' },
        { status: 400 }
      );
    }

    const currentTimestamp = new Date().toISOString();
    const payload = {
      userId: body.userId || 1,
      agentNotRespondingEnabled: body.agentNotRespondingEnabled || false,
      agentNotRespondingMinutes: body.agentNotRespondingMinutes || 0,
      agentNotRespondingSeconds: body.agentNotRespondingSeconds || 0,
      archiveChatEnabled: body.archiveChatEnabled || false,
      archiveChatMinutes: body.archiveChatMinutes || 0,
      archiveChatSeconds: body.archiveChatSeconds || 0,
      visitorInactivityMinutes: body.visitorInactivityMinutes || 2,
      visitorInactivitySeconds: body.visitorInactivitySeconds || 0,
      timeoutMessage: body.timeoutMessage,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp
    };

    const res = await fetch(`${BACKEND_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to create inactivity timeout');
    }

    return NextResponse.json(await res.json());

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to create inactivity timeout' },
      { status: 500 }
    );
  }
}

// Updated PUT handler in route.ts
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { message: 'Inactivity timeout ID is required for update' },
        { status: 400 }
      );
    }

    // Fetch existing record to get the original createdAt
    const getResponse = await fetch(`${BACKEND_BASE_URL}/${body.id}`);
    if (!getResponse.ok) {
      throw new Error('Failed to fetch existing record');
    }
    const existingRecord = await getResponse.json();

    const currentTimestamp = new Date().toISOString();
    const payload = {
      id: body.id,
      userId: body.userId || existingRecord.userId || 1,
      agentNotRespondingEnabled: body.agentNotRespondingEnabled ?? existingRecord.agentNotRespondingEnabled,
      agentNotRespondingMinutes: body.agentNotRespondingMinutes ?? existingRecord.agentNotRespondingMinutes,
      agentNotRespondingSeconds: body.agentNotRespondingSeconds ?? existingRecord.agentNotRespondingSeconds,
      archiveChatEnabled: body.archiveChatEnabled ?? existingRecord.archiveChatEnabled,
      archiveChatMinutes: body.archiveChatMinutes ?? existingRecord.archiveChatMinutes,
      archiveChatSeconds: body.archiveChatSeconds ?? existingRecord.archiveChatSeconds,
      visitorInactivityMinutes: body.visitorInactivityMinutes ?? existingRecord.visitorInactivityMinutes,
      visitorInactivitySeconds: body.visitorInactivitySeconds ?? existingRecord.visitorInactivitySeconds,
      timeoutMessage: body.timeoutMessage || existingRecord.timeoutMessage,
      createdAt: existingRecord.createdAt, // Use existing createdAt
      updatedAt: currentTimestamp
    };

    const res = await fetch(`${BACKEND_BASE_URL}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to update inactivity timeout');
    }

    return NextResponse.json(await res.json());

  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        message: error.message || 'Failed to update inactivity timeout',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}