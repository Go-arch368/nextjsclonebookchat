import { NextResponse } from 'next/server';

// TypeScript interface for the mail template
interface MailTemplate {
  id: number;
  userId: number;
  name: string;
  useCase: string;
  subject: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

// In-memory store for mail templates (replace with a database in production)
let mailTemplates: MailTemplate[] = [];

// GET: Handle /all and /search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'all') {
      // GET /api/v1/settings/mail-templates?action=all
      return NextResponse.json(mailTemplates, { status: 200 });
    } else if (action === 'search') {
      // GET /api/v1/settings/mail-templates?action=search&keyword=...&page=...&size=...
      const keyword = searchParams.get('keyword')?.toLowerCase() || '';
      const page = parseInt(searchParams.get('page') || '0', 10);
      const size = parseInt(searchParams.get('size') || '10', 10);

      const filteredTemplates = mailTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(keyword) ||
          template.useCase.toLowerCase().includes(keyword) ||
          template.subject.toLowerCase().includes(keyword) ||
          template.createdBy.toLowerCase().includes(keyword) ||
          template.modifiedBy.toLowerCase().includes(keyword)
      );

      const start = page * size;
      const end = start + size;
      const paginatedTemplates = filteredTemplates.slice(start, end);

      return NextResponse.json(paginatedTemplates, { status: 200 });
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

    const body: MailTemplate = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.useCase?.trim()) {
      return NextResponse.json({ error: 'Use Case is required' }, { status: 400 });
    }
    if (!body.createdBy?.trim()) {
      return NextResponse.json({ error: 'Created By is required' }, { status: 400 });
    }
    if (!body.modifiedBy?.trim()) {
      return NextResponse.json({ error: 'Modified By is required' }, { status: 400 });
    }

    // Create new template
    const newTemplate: MailTemplate = {
      id: body.id || Date.now(), // Use provided ID or generate new one
      userId: body.userId || 1, // Default to 1 if not provided
      name: body.name,
      useCase: body.useCase,
      subject: body.subject || 'Default Subject',
      active: body.active !== undefined ? body.active : true,
      createdBy: body.createdBy,
      createdAt: body.createdAt || new Date().toISOString().slice(0, 19),
      modifiedBy: body.modifiedBy,
      modifiedAt: body.modifiedAt || new Date().toISOString().slice(0, 19),
    };

    mailTemplates.push(newTemplate);

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating mail template:', error);
    return NextResponse.json(
      { error: 'Failed to create mail template' },
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

    const body: MailTemplate = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!body.useCase?.trim()) {
      return NextResponse.json({ error: 'Use Case is required' }, { status: 400 });
    }
    if (!body.createdBy?.trim()) {
      return NextResponse.json({ error: 'Created By is required' }, { status: 400 });
    }
    if (!body.modifiedBy?.trim()) {
      return NextResponse.json({ error: 'Modified By is required' }, { status: 400 });
    }

    // Find and update the template
    const index = mailTemplates.findIndex((template) => template.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const updatedTemplate: MailTemplate = {
      ...mailTemplates[index],
      name: body.name,
      useCase: body.useCase,
      subject: body.subject,
      active: body.active,
      createdBy: body.createdBy,
      createdAt: body.createdAt || mailTemplates[index].createdAt,
      modifiedBy: body.modifiedBy,
      modifiedAt: body.modifiedAt || new Date().toISOString().slice(0, 19),
      userId: body.userId || mailTemplates[index].userId,
    };

    mailTemplates[index] = updatedTemplate;

    return NextResponse.json(updatedTemplate, { status: 200 });
  } catch (error) {
    console.error('Error updating mail template:', error);
    return NextResponse.json(
      { error: 'Failed to update mail template' },
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
      // DELETE /api/v1/settings/mail-templates?action=delete&id=...
      const id = parseInt(searchParams.get('id') || '0', 10);
      if (isNaN(id) || id === 0) {
        return NextResponse.json({ error: 'Invalid Template ID' }, { status: 400 });
      }

      const index = mailTemplates.findIndex((template) => template.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }

      mailTemplates.splice(index, 1);
      return NextResponse.json(
        { message: 'Template deleted successfully' },
        { status: 200 }
      );
    } else if (action === 'delete-all') {
      // DELETE /api/v1/settings/mail-templates?action=delete-all
      mailTemplates = [];
      return NextResponse.json(
        { message: 'All templates deleted successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}