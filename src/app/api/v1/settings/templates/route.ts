import { NextResponse } from 'next/server';

// TypeScript interface for the template
interface Template {
  id: number;
  userId: number;
  businessCategory: string;
  businessSubcategory: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory store for templates (replace with a database in production)
let templates: Template[] = [];

// GET: Handle /all and /search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'all') {
      // GET /api/v1/settings/templates?action=all
      return NextResponse.json(templates, { status: 200 });
    } else if (action === 'search') {
      // GET /api/v1/settings/templates?action=search&keyword=...&page=...&size=...
      const keyword = searchParams.get('keyword')?.toLowerCase() || '';
      const page = parseInt(searchParams.get('page') || '0', 10);
      const size = parseInt(searchParams.get('size') || '10', 10);

      const filteredTemplates = templates.filter(
        (template) =>
          template.businessCategory.toLowerCase().includes(keyword) ||
          template.businessSubcategory.toLowerCase().includes(keyword) ||
          template.createdBy.toLowerCase().includes(keyword)
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

    const body: Template = await request.json();

    // Validate required fields
    if (!body.businessCategory?.trim()) {
      return NextResponse.json(
        { error: 'Business Category is required' },
        { status: 400 }
      );
    }
    if (!body.businessSubcategory?.trim()) {
      return NextResponse.json(
        { error: 'Business Subcategory is required' },
        { status: 400 }
      );
    }

    // Create new template
    const newTemplate: Template = {
      id: body.id || Date.now(), // Use provided ID or generate new one
      userId: body.userId || 1, // Default to 1 if not provided
      businessCategory: body.businessCategory,
      businessSubcategory: body.businessSubcategory,
      createdBy: body.createdBy || 'admin',
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    templates.push(newTemplate);

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
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

    const body: Template = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }
    if (!body.businessCategory?.trim()) {
      return NextResponse.json(
        { error: 'Business Category is required' },
        { status: 400 }
      );
    }
    if (!body.businessSubcategory?.trim()) {
      return NextResponse.json(
        { error: 'Business Subcategory is required' },
        { status: 400 }
      );
    }

    // Find and update the template
    const index = templates.findIndex((template) => template.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const updatedTemplate: Template = {
      ...templates[index],
      businessCategory: body.businessCategory,
      businessSubcategory: body.businessSubcategory,
      updatedAt: new Date().toISOString(),
      createdBy: body.createdBy || templates[index].createdBy,
      userId: body.userId || templates[index].userId,
      createdAt: body.createdAt || templates[index].createdAt,
    };

    templates[index] = updatedTemplate;

    return NextResponse.json(updatedTemplate, { status: 200 });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
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
      // DELETE /api/v1/settings/templates?action=delete&id=...
      const id = parseInt(searchParams.get('id') || '0', 10);
      if (isNaN(id) || id === 0) {
        return NextResponse.json(
          { error: 'Invalid Template ID' },
          { status: 400 }
        );
      }

      const index = templates.findIndex((template) => template.id === id);
      if (index === -1) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }

      templates.splice(index, 1);
      return NextResponse.json(
        { message: 'Template deleted successfully' },
        { status: 200 }
      );
    } else if (action === 'delete-all') {
      // DELETE /api/v1/settings/templates?action=delete-all
      templates = [];
      return NextResponse.json(
        { message: 'All templates deleted successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}