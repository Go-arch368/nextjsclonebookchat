import { NextRequest, NextResponse } from 'next/server';

// Simulated in-memory database for demonstration
let queuedMessages = [
  {
    id: 1,
    userId: 1,
    message: 'Welcome to +Company Name, please wait for %minutes% minutes.',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    imageUrl: '',
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
      return NextResponse.json(queuedMessages);
    } catch (error: any) {
      console.error('Error in GET /list:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch queued messages' },
        { status: 500 }
      );
    }
  } else if (action === 'search' && keyword) {
    try {
      // Simulate search
      const filteredMessages = queuedMessages.filter(
        (message) =>
          message.message.toLowerCase().includes(keyword.toLowerCase()) ||
          message.createdBy.toLowerCase().includes(keyword.toLowerCase()) ||
          message.company.toLowerCase().includes(keyword.toLowerCase())
      );
      return NextResponse.json(filteredMessages);
    } catch (error: any) {
      console.error('Error in GET /search:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to search queued messages' },
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
    if (!body.message || !body.createdBy || !body.company) {
      return NextResponse.json(
        { message: 'Missing required fields: message, createdBy, company' },
        { status: 400 }
      );
    }

    // Check for duplicate message
    if (queuedMessages.some((m) => m.message === body.message)) {
      return NextResponse.json(
        { message: `Duplicate entry '${body.message}' for key 'message'` },
        { status: 400 }
      );
    }

    const newMessage = {
      id: queuedMessages.length + 1,
      userId: body.userId || 1,
      message: body.message,
      backgroundColor: body.backgroundColor || '#FFFFFF',
      textColor: body.textColor || '#000000',
      imageUrl: body.imageUrl || '',
      createdBy: body.createdBy,
      company: body.company,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queuedMessages.push(newMessage);
    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error('Error in POST:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to add queued message' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.message || !body.createdBy || !body.company) {
      return NextResponse.json(
        { message: 'Missing required fields: id, message, createdBy, company' },
        { status: 400 }
      );
    }

    const index = queuedMessages.findIndex((m) => m.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { message: `Queued message with id ${body.id} not found` },
        { status: 404 }
      );
    }

    // Check for duplicate message (excluding the current message)
    if (queuedMessages.some((m, i) => m.message === body.message && i !== index)) {
      return NextResponse.json(
        { message: `Duplicate entry '${body.message}' for key 'message'` },
        { status: 400 }
      );
    }

    queuedMessages[index] = {
      ...queuedMessages[index],
      message: body.message,
      backgroundColor: body.backgroundColor || '#FFFFFF',
      textColor: body.textColor || '#000000',
      imageUrl: body.imageUrl || '',
      createdBy: body.createdBy,
      company: body.company,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(queuedMessages[index]);
  } catch (error: any) {
    console.error('Error in PUT:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update queued message' },
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
      queuedMessages = [];
      return NextResponse.json({ message: 'All queued messages cleared successfully' });
    } catch (error: any) {
      console.error('Error in DELETE /clear:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to clear queued messages' },
        { status: 500 }
      );
    }
  } else if (id) {
    try {
      const index = queuedMessages.findIndex((m) => m.id === parseInt(id));
      if (index === -1) {
        return NextResponse.json(
          { message: `Queued message with id ${id} not found` },
          { status: 404 }
        );
      }
      queuedMessages.splice(index, 1);
      return NextResponse.json({ message: `Queued message ${id} deleted successfully` });
    } catch (error: any) {
      console.error(`Error in DELETE /${id}:`, error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to delete queued message' },
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