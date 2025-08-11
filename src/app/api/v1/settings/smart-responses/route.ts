
import { NextRequest, NextResponse } from 'next/server';

// Simulated in-memory database for demonstration
let smartResponses = [
  {
    id: 1,
    userId: 1,
    response: 'Thank you for contacting +Company Name!',
    shortcuts: ['thanks', 'welcome'],
    websites: ['https://example.com'],
    createdBy: 'Admin',
    company: 'Example Corp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const keyword = searchParams.get('keyword');

  if (action === 'list') {
    try {
      // Simulate fetching from backend or database
      return NextResponse.json(smartResponses);
    } catch (error: any) {
      console.error('Error in GET /list:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch smart responses' },
        { status: 500 }
      );
    }
  } else if (action === 'search' && keyword) {
    try {
      // Simulate search
      const filteredResponses = smartResponses.filter(
        (response) =>
          response.response.toLowerCase().includes(keyword.toLowerCase()) ||
          response.createdBy.toLowerCase().includes(keyword.toLowerCase()) ||
          response.company.toLowerCase().includes(keyword.toLowerCase()) ||
          response.shortcuts.some((shortcut) => shortcut.toLowerCase().includes(keyword.toLowerCase())) ||
          response.websites.some((website) => website.toLowerCase().includes(keyword.toLowerCase()))
      );
      return NextResponse.json(filteredResponses);
    } catch (error: any) {
      console.error('Error in GET /search:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to search smart responses' },
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
    if (!body.response || !body.createdBy || !body.company || !body.shortcuts || body.shortcuts.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields: response, createdBy, company, shortcuts' },
        { status: 400 }
      );
    }

    // Check for duplicate shortcuts
    if (smartResponses.some((r) => r.shortcuts.some((s) => body.shortcuts.includes(s)))) {
      const duplicate = body.shortcuts.find((s: string) =>
        smartResponses.some((r) => r.shortcuts.includes(s))
      );
      return NextResponse.json(
        { message: `Duplicate entry '${duplicate}' for key 'shortcuts'` },
        { status: 400 }
      );
    }

    const newResponse = {
      id: smartResponses.length + 1,
      userId: body.userId || 1,
      response: body.response,
      shortcuts: body.shortcuts,
      websites: body.websites || [],
      createdBy: body.createdBy,
      company: body.company,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    smartResponses.push(newResponse);
    return NextResponse.json(newResponse);
  } catch (error: any) {
    console.error('Error in POST:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to add smart response' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.response || !body.createdBy || !body.company || !body.shortcuts || body.shortcuts.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields: id, response, createdBy, company, shortcuts' },
        { status: 400 }
      );
    }

    const index = smartResponses.findIndex((r) => r.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { message: `Smart response with id ${body.id} not found` },
        { status: 404 }
      );
    }

    // Check for duplicate shortcuts (excluding the current response)
    if (
      smartResponses.some(
        (r, i) => i !== index && r.shortcuts.some((s) => body.shortcuts.includes(s))
      )
    ) {
      const duplicate = body.shortcuts.find((s: string) =>
        smartResponses.some((r, i) => i !== index && r.shortcuts.includes(s))
      );
      return NextResponse.json(
        { message: `Duplicate entry '${duplicate}' for key 'shortcuts'` },
        { status: 400 }
      );
    }

    smartResponses[index] = {
      ...smartResponses[index],
      response: body.response,
      shortcuts: body.shortcuts,
      websites: body.websites || [],
      createdBy: body.createdBy,
      company: body.company,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(smartResponses[index]);
  } catch (error: any) {
    console.error('Error in PUT:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update smart response' },
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
      smartResponses = [];
      return NextResponse.json({ message: 'All smart responses cleared successfully' });
    } catch (error: any) {
      console.error('Error in DELETE /clear:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to clear smart responses' },
        { status: 500 }
      );
    }
  } else if (id) {
    try {
      const index = smartResponses.findIndex((r) => r.id === parseInt(id));
      if (index === -1) {
        return NextResponse.json(
          { message: `Smart response with id ${id} not found` },
          { status: 404 }
        );
      }
      smartResponses.splice(index, 1);
      return NextResponse.json({ message: `Smart response ${id} deleted successfully` });
    } catch (error: any) {
      console.error(`Error in DELETE /${id}:`, error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to delete smart response' },
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
