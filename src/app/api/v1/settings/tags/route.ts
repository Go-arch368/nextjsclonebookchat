
import { NextRequest, NextResponse } from 'next/server';

// Simulated in-memory database for demonstration
let tags = [
  {
    id: 1,
    userId: 1,
    tag: 'support',
    isDefault: false,
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
      return NextResponse.json(tags);
    } catch (error: any) {
      console.error('Error in GET /list:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to fetch tags' },
        { status: 500 }
      );
    }
  } else if (action === 'search' && keyword) {
    try {
      // Simulate search
      const filteredTags = tags.filter(
        (tag) =>
          tag.tag.toLowerCase().includes(keyword.toLowerCase()) ||
          tag.createdBy.toLowerCase().includes(keyword.toLowerCase()) ||
          tag.company.toLowerCase().includes(keyword.toLowerCase())
      );
      return NextResponse.json(filteredTags);
    } catch (error: any) {
      console.error('Error in GET /search:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to search tags' },
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
    if (!body.tag || !body.createdBy || !body.company) {
      return NextResponse.json(
        { message: 'Missing required fields: tag, createdBy, company' },
        { status: 400 }
      );
    }

    // Check for duplicate tag
    if (tags.some((t) => t.tag.toLowerCase() === body.tag.toLowerCase())) {
      return NextResponse.json(
        { message: `Duplicate entry '${body.tag}' for key 'tag'` },
        { status: 400 }
      );
    }

    const newTag = {
      id: tags.length + 1,
      userId: body.userId || 1,
      tag: body.tag,
      isDefault: body.isDefault || false,
      createdBy: body.createdBy,
      company: body.company,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tags.push(newTag);
    return NextResponse.json(newTag);
  } catch (error: any) {
    console.error('Error in POST:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to add tag' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.tag || !body.createdBy || !body.company) {
      return NextResponse.json(
        { message: 'Missing required fields: id, tag, createdBy, company' },
        { status: 400 }
      );
    }

    const index = tags.findIndex((t) => t.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { message: `Tag with id ${body.id} not found` },
        { status: 404 }
      );
    }

    // Check for duplicate tag (excluding the current tag)
    if (tags.some((t, i) => i !== index && t.tag.toLowerCase() === body.tag.toLowerCase())) {
      return NextResponse.json(
        { message: `Duplicate entry '${body.tag}' for key 'tag'` },
        { status: 400 }
      );
    }

    tags[index] = {
      ...tags[index],
      tag: body.tag,
      isDefault: body.isDefault || false,
      createdBy: body.createdBy,
      company: body.company,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(tags[index]);
  } catch (error: any) {
    console.error('Error in PUT:', error.message, error.stack);
    return NextResponse.json(
      { message: error.message || 'Failed to update tag' },
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
      tags = [];
      return NextResponse.json({ message: 'All tags cleared successfully' });
    } catch (error: any) {
      console.error('Error in DELETE /clear:', error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to clear tags' },
        { status: 500 }
      );
    }
  } else if (id) {
    try {
      const index = tags.findIndex((t) => t.id === parseInt(id));
      if (index === -1) {
        return NextResponse.json(
          { message: `Tag with id ${id} not found` },
          { status: 404 }
        );
      }
      tags.splice(index, 1);
      return NextResponse.json({ message: `Tag ${id} deleted successfully` });
    } catch (error: any) {
      console.error(`Error in DELETE /${id}:`, error.message, error.stack);
      return NextResponse.json(
        { message: error.message || 'Failed to delete tag' },
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
