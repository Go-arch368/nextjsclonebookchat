import { NextResponse } from 'next/server';

// TypeScript interface for the IP address
interface IPAddress {
  id: number;
  userId: number;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory store for IP addresses (replace with a database in production)
let ipAddresses: IPAddress[] = [];

// GET: Handle /all and /search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'all') {
      // GET /api/v1/settings/ip-addresses?action=all
      return NextResponse.json(ipAddresses, { status: 200 });
    } else if (action === 'search') {
      // GET /api/v1/settings/ip-addresses?action=search&keyword=...&page=...&size=...
      const keyword = searchParams.get('keyword')?.toLowerCase() || '';
      const page = parseInt(searchParams.get('page') || '0', 10);
      const size = parseInt(searchParams.get('size') || '10', 10);

      const filteredIPAddresses = ipAddresses.filter(
        (ipAddress) => ipAddress.ipAddress.toLowerCase().includes(keyword)
      );

      const start = page * size;
      const end = start + size;
      const paginatedIPAddresses = filteredIPAddresses.slice(start, end);

      return NextResponse.json(paginatedIPAddresses, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling GET request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Handle /save
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action !== 'save') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const body: IPAddress = await request.json();

    // Validate required fields
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!body.ipAddress?.trim()) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
    } else if (!ipRegex.test(body.ipAddress)) {
      return NextResponse.json(
        { error: 'Please provide a valid IP address (e.g., 192.168.1.1)' },
        { status: 400 }
      );
    }

    // Check for duplicate IP address
    if (ipAddresses.some((ip) => ip.ipAddress === body.ipAddress)) {
      return NextResponse.json(
        { error: 'IP address already exists' },
        { status: 400 }
      );
    }

    // Create new IP address
    const newIPAddress: IPAddress = {
      id: body.id || Date.now(), // Use provided ID or generate new one
      userId: body.userId || 1, // Default to 1 if not provided
      ipAddress: body.ipAddress,
      createdAt: body.createdAt || new Date().toISOString().slice(0, 19),
      updatedAt: new Date().toISOString().slice(0, 19),
    };

    ipAddresses.push(newIPAddress);

    return NextResponse.json(newIPAddress, { status: 201 });
  } catch (error) {
    console.error('Error creating IP address:', error);
    return NextResponse.json(
      { error: 'Failed to create IP address' },
      { status: 500 }
    );
  }
}

// PUT: Handle /update
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action !== 'update') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const body: IPAddress = await request.json();

    // Validate required fields
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!body.id) {
      return NextResponse.json({ error: 'IP address ID is required' }, { status: 400 });
    }
    if (!body.ipAddress?.trim()) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
    } else if (!ipRegex.test(body.ipAddress)) {
      return NextResponse.json(
        { error: 'Please provide a valid IP address (e.g., 192.168.1.1)' },
        { status: 400 }
      );
    }

    // Check for duplicate IP address (excluding the current ID)
    if (ipAddresses.some((ip) => ip.ipAddress === body.ipAddress && ip.id !== body.id)) {
      return NextResponse.json(
        { error: 'IP address already exists' },
        { status: 400 }
      );
    }

    // Find and update the IP address
    const index = ipAddresses.findIndex((ipAddress) => ipAddress.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'IP address not found' }, { status: 404 });
    }

    const updatedIPAddress: IPAddress = {
      ...ipAddresses[index],
      ipAddress: body.ipAddress,
      userId: body.userId || ipAddresses[index].userId,
      createdAt: body.createdAt || ipAddresses[index].createdAt,
      updatedAt: new Date().toISOString().slice(0, 19),
    };

    ipAddresses[index] = updatedIPAddress;

    return NextResponse.json(updatedIPAddress, { status: 200 });
  } catch (error) {
    console.error('Error updating IP address:', error);
    return NextResponse.json(
      { error: 'Failed to update IP address' },
      { status: 500 }
    );
  }
}

// DELETE: Handle /delete/:id and /delete/all
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'delete') {
      // DELETE /api/v1/settings/ip-addresses?action=delete&id=...
      const id = parseInt(searchParams.get('id') || '0', 10);
      if (isNaN(id) || id === 0) {
        return NextResponse.json({ error: 'Invalid IP address ID' }, { status: 400 });
      }

      const index = ipAddresses.findIndex((ipAddress) => ipAddress.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'IP address not found' }, { status: 404 });
      }

      ipAddresses.splice(index, 1);
      return NextResponse.json(
        { message: 'IP address deleted successfully' },
        { status: 200 }
      );
    } else if (action === 'delete-all') {
      // DELETE /api/v1/settings/ip-addresses?action=delete-all
      ipAddresses = [];
      return NextResponse.json(
        { message: 'All IP addresses deleted successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}