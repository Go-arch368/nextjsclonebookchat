import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/global-notifications`
  : 'https://zotly.onrender.com/api/v1/settings/global-notifications';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/all`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to fetch notification settings');
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch notification settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (body.useSameEmail && !body.notificationsEmail) {
      return NextResponse.json(
        { message: 'Notifications email is required when using the same email' },
        { status: 400 }
      );
    }

    const currentTimestamp = new Date().toISOString();
    const payload = {
      userId: body.userId || 1,
      useSameEmail: body.useSameEmail,
      notificationsEmail: body.notificationsEmail || '',
      notifyLead: body.notifyLead || false,
      notifyServiceChat: body.notifyServiceChat || false,
      createdAt: currentTimestamp, // Explicitly set created_at
      updatedAt: currentTimestamp  // And updated_at
    };

    const res = await fetch(`${BACKEND_BASE_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to create notification setting');
    }

    return NextResponse.json(await res.json());

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to create notification setting' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { message: 'Notification setting ID is required for update' },
        { status: 400 }
      );
    }

    const payload = {
      id: body.id,
      useSameEmail: body.useSameEmail,
      notificationsEmail: body.notificationsEmail || '',
      notifyLead: body.notifyLead || false,
      notifyServiceChat: body.notifyServiceChat || false,
    };

    const res = await fetch(`${BACKEND_BASE_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to update notification setting');
    }

    return NextResponse.json(await res.json());

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update notification setting' },
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
        { message: 'Notification setting ID is required' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to delete notification setting');
    }

    return NextResponse.json(
      { message: `Notification setting ${id} deleted successfully` },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete notification setting' },
      { status: 500 }
    );
  }
}