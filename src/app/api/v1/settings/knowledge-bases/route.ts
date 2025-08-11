import { NextResponse } from 'next/server';

// TypeScript interface for the knowledge base record
interface KnowledgeBaseRecord {
  id?: number;
  userId?: number;
  questionTitle: string;
  answerInformation: string;
  keywords: string;
  websites: string[];
  createdAt?: string;
  updatedAt?: string;
}

// In-memory store for knowledge base records (replace with a database in production)
let knowledgeBaseRecords: KnowledgeBaseRecord[] = [];

// GET: Handle /all and /search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'all') {
      // GET /api/v1/settings/knowledge-bases?action=all
      return NextResponse.json(knowledgeBaseRecords, { status: 200 });
    } else if (action === 'search') {
      // GET /api/v1/settings/knowledge-bases?action=search&keyword=...&page=...&size=...
      const keyword = searchParams.get('keyword')?.toLowerCase() || '';
      const page = parseInt(searchParams.get('page') || '0', 10);
      const size = parseInt(searchParams.get('size') || '5', 10);

      const filteredRecords = knowledgeBaseRecords.filter(
        (record) =>
          record.questionTitle.toLowerCase().includes(keyword) ||
          record.answerInformation.toLowerCase().includes(keyword) ||
          record.keywords.toLowerCase().includes(keyword) ||
          record.websites.some((website) => website.toLowerCase().includes(keyword))
      );

      const start = page * size;
      const end = start + size;
      const paginatedRecords = filteredRecords.slice(start, end);

      return NextResponse.json(paginatedRecords, { status: 200 });
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

    const body: KnowledgeBaseRecord = await request.json();

    // Validate required fields
    if (!body.questionTitle?.trim()) {
      return NextResponse.json({ error: 'Question/Title is required' }, { status: 400 });
    }
    if (!body.answerInformation?.trim()) {
      return NextResponse.json({ error: 'Answer/Information is required' }, { status: 400 });
    }
    if (!body.keywords?.trim()) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
    }

    // Create new knowledge base record
    const newRecord: KnowledgeBaseRecord = {
      id: body.id || Date.now(), // Use provided ID or generate new one
      userId: body.userId || 1, // Default to 1 if not provided
      questionTitle: body.questionTitle.trim(),
      answerInformation: body.answerInformation.trim(),
      keywords: body.keywords.trim(),
      websites: body.websites || [],
      createdAt: body.createdAt || new Date().toISOString().slice(0, 19),
      updatedAt: new Date().toISOString().slice(0, 19),
    };

    knowledgeBaseRecords.push(newRecord);

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating knowledge base record:', error);
    return NextResponse.json(
      { error: 'Failed to create knowledge base record' },
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

    const body: KnowledgeBaseRecord = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }
    if (!body.questionTitle?.trim()) {
      return NextResponse.json({ error: 'Question/Title is required' }, { status: 400 });
    }
    if (!body.answerInformation?.trim()) {
      return NextResponse.json({ error: 'Answer/Information is required' }, { status: 400 });
    }
    if (!body.keywords?.trim()) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
    }

    // Find and update the knowledge base record
    const index = knowledgeBaseRecords.findIndex((record) => record.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Knowledge base record not found' }, { status: 404 });
    }

    const updatedRecord: KnowledgeBaseRecord = {
      ...knowledgeBaseRecords[index],
      questionTitle: body.questionTitle.trim(),
      answerInformation: body.answerInformation.trim(),
      keywords: body.keywords.trim(),
      websites: body.websites || [],
      userId: body.userId || knowledgeBaseRecords[index].userId,
      createdAt: body.createdAt || knowledgeBaseRecords[index].createdAt,
      updatedAt: new Date().toISOString().slice(0, 19),
    };

    knowledgeBaseRecords[index] = updatedRecord;

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error('Error updating knowledge base record:', error);
    return NextResponse.json(
      { error: 'Failed to update knowledge base record' },
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
      // DELETE /api/v1/settings/knowledge-bases?action=delete&id=...
      const id = parseInt(searchParams.get('id') || '0', 10);
      if (isNaN(id) || id === 0) {
        return NextResponse.json({ error: 'Invalid record ID' }, { status: 400 });
      }

      const index = knowledgeBaseRecords.findIndex((record) => record.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'Knowledge base record not found' }, { status: 404 });
      }

      knowledgeBaseRecords.splice(index, 1);
      return NextResponse.json(
        { message: 'Knowledge base record deleted successfully' },
        { status: 200 }
      );
    } else if (action === 'delete-all') {
      // DELETE /api/v1/settings/knowledge-bases?action=delete-all
      knowledgeBaseRecords = [];
      return NextResponse.json(
        { message: 'All knowledge base records deleted successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}