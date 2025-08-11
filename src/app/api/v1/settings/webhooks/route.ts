
import { NextRequest, NextResponse } from 'next/server';

// Simulated in-memory database for demonstration
let webhooks = [
  {
    id: 1,
    userId: 1,
    event: 'CHAT_STARTS',
    dataTypes: ['Visitor Info', 'Chat Info'],
    targetUrl: 'https://example.com/webhook',
    createdBy: 'admin',
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
      return NextResponse.json(webhooks);
    } catch (error: any) {
      console.error('Error in GET /list:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch webhooks' },
        { status: 500 }
      );
    }
  } else if (action === 'search' && keyword) {
    try {
      // Simulate search
      const filteredWebhooks = webhooks.filter(
        (webhook) =>
          webhook.event.toLowerCase().includes(keyword.toLowerCase()) ||
          webhook.targetUrl.toLowerCase().includes(keyword.toLowerCase()) ||
          webhook.createdBy.toLowerCase().includes(keyword.toLowerCase()) ||
          webhook.company.toLowerCase().includes(keyword.toLowerCase()) ||
          webhook.dataTypes.some((type) => type.toLowerCase().includes(keyword.toLowerCase()))
      );
      return NextResponse.json(filteredWebhooks);
    } catch (error: any) {
      console.error('Error in GET /search:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to search webhooks' },
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
    if (!body.event || !body.dataTypes || body.dataTypes.length === 0 || !body.targetUrl || !body.createdBy || !body.company) {
      return NextResponse.json(
        { message: 'Missing required fields: event, dataTypes, targetUrl, createdBy, company' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(body.targetUrl);
    } catch {
      return NextResponse.json(
        { message: 'Invalid targetUrl format' },
        { status: 400 }
      );
    }

    // Check for duplicate webhook (same event and targetUrl)
    if (
      webhooks.some(
        (w) => w.event === body.event && w.targetUrl.toLowerCase() === body.targetUrl.toLowerCase()
      )
    ) {
      return NextResponse.json(
        { message: `Duplicate webhook for event '${body.event}' and URL '${body.targetUrl}'` },
        { status: 400 }
      );
    }

    const newWebhook = {
      id: webhooks.length + 1,
      userId: body.userId || 1,
      event: body.event,
      dataTypes: body.dataTypes,
      targetUrl: body.targetUrl,
      createdBy: body.createdBy.toLowerCase(),
      company: body.company,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    webhooks.push(newWebhook);
    return NextResponse.json(newWebhook);
  } catch (error: any) {
    console.error('Error in POST:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to add webhook' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.event || !body.dataTypes || body.dataTypes.length === 0 || !body.targetUrl || !body.createdBy || !body.company) {
      return NextResponse.json(
        { message: 'Missing required fields: id, event, dataTypes, targetUrl, createdBy, company' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(body.targetUrl);
    } catch {
      return NextResponse.json(
        { message: 'Invalid targetUrl format' },
        { status: 400 }
      );
    }

    const index = webhooks.findIndex((w) => w.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { message: `Webhook with id ${body.id} not found` },
        { status: 404 }
      );
    }

    // Check for duplicate webhook (same event and targetUrl, excluding current webhook)
    if (
      webhooks.some(
        (w, i) =>
          i !== index &&
          w.event === body.event &&
          w.targetUrl.toLowerCase() === body.targetUrl.toLowerCase()
      )
    ) {
      return NextResponse.json(
        { message: `Duplicate webhook for event '${body.event}' and URL '${body.targetUrl}'` },
        { status: 400 }
      );
    }

    webhooks[index] = {
      ...webhooks[index],
      event: body.event,
      dataTypes: body.dataTypes,
      targetUrl: body.targetUrl,
      createdBy: body.createdBy.toLowerCase(),
      company: body.company,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(webhooks[index]);
  } catch (error: any) {
    console.error('Error in PUT:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update webhook' },
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
      webhooks = [];
      return NextResponse.json({ message: 'All webhooks cleared successfully' });
    } catch (error: any) {
      console.error('Error in DELETE /clear:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to clear webhooks' },
        { status: 500 }
      );
    }
  } else if (id) {
    try {
      const index = webhooks.findIndex((w) => w.id === parseInt(id));
      if (index === -1) {
        return NextResponse.json(
          { message: `Webhook with id ${id} not found` },
          { status: 404 }
        );
      }
      webhooks.splice(index, 1);
      return NextResponse.json({ message: `Webhook ${id} deleted successfully` });
    } catch (error: any) {
      console.error(`Error in DELETE /${id}:`, error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to delete webhook' },
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
