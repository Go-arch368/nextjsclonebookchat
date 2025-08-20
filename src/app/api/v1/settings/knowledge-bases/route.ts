import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/v1/settings/knowledge-bases`
  : 'https://zotly.onrender.com/api/v1/settings/knowledge-bases';

// In-memory storage as fallback when backend fails
let memoryStorage: any[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';

    let url;
    if (action === 'search' && keyword) {
      url = `${BACKEND_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    } else if (action === 'all') {
      url = `${BACKEND_BASE_URL}/all`;
    } else {
      url = BACKEND_BASE_URL; // Default endpoint
    }

    console.log('Fetching knowledge bases from:', url);

    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    const responseText = await res.text();
    console.log('Backend response status:', res.status);

    if (res.ok) {
      try {
        const data = JSON.parse(responseText);
        // Update memory storage with backend data
        const arrayData = Array.isArray(data) ? data : [];
        memoryStorage = arrayData;
        return NextResponse.json(arrayData);
      } catch (e) {
        console.warn('Backend returned invalid JSON, using memory storage');
        return NextResponse.json(memoryStorage);
      }
    } else {
      console.warn('Backend failed, using memory storage');
      return NextResponse.json(memoryStorage);
    }

  } catch (error: any) {
    console.error('Error in GET knowledge bases:', error.message);
    return NextResponse.json(memoryStorage); // Fallback to memory storage
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    if (action !== 'save') {
      return NextResponse.json(
        { message: 'Invalid action parameter' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const now = new Date().toISOString();
    
    // Validate required fields
    if (!body.questionTitle?.trim()) {
      return NextResponse.json(
        { message: 'Question/Title is required' },
        { status: 400 }
      );
    }
    if (!body.answerInformation?.trim()) {
      return NextResponse.json(
        { message: 'Answer/Information is required' },
        { status: 400 }
      );
    }
    if (!body.keywords?.trim()) {
      return NextResponse.json(
        { message: 'Keywords are required' },
        { status: 400 }
      );
    }

    // Remove ID to prevent concurrency errors
    const { id, ...payloadWithoutId } = body;

    const payload = {
      ...payloadWithoutId,
      userId: body.userId || 1,
      createdAt: now,
      updatedAt: now,
      websites: Array.isArray(body.websites) ? body.websites : [],
    };

    console.log('Creating knowledge base:', payload);

    // Try to save to backend
    let savedRecord;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      
      if (res.ok) {
        try {
          savedRecord = JSON.parse(responseText);
        } catch (e) {
          savedRecord = { ...payload, id: Date.now() };
        }
      } else {
        throw new Error(`Backend responded with status ${res.status}`);
      }
    } catch (backendError) {
      console.warn('Backend save failed, using memory storage:', backendError);
      // Create record in memory storage
      savedRecord = {
        ...payload,
        id: Date.now(), // Generate unique ID for memory storage
      };
    }

    // Add to memory storage
    memoryStorage = [savedRecord, ...memoryStorage];
    console.log('Record saved to memory:', savedRecord);

    return NextResponse.json(savedRecord);

  } catch (error: any) {
    console.error('Error in POST knowledge base:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to create knowledge base record' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    if (action !== 'update') {
      return NextResponse.json(
        { message: 'Invalid action parameter' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const now = new Date().toISOString();
    
    if (!body.id) {
      return NextResponse.json(
        { message: 'Record ID is required for update' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.questionTitle?.trim()) {
      return NextResponse.json(
        { message: 'Question/Title is required' },
        { status: 400 }
      );
    }
    if (!body.answerInformation?.trim()) {
      return NextResponse.json(
        { message: 'Answer/Information is required' },
        { status: 400 }
      );
    }
    if (!body.keywords?.trim()) {
      return NextResponse.json(
        { message: 'Keywords are required' },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      updatedAt: now,
      websites: Array.isArray(body.websites) ? body.websites : [],
    };

    console.log('Updating knowledge base:', payload);

    // Try to update in backend
    let updatedRecord;
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      
      if (res.ok) {
        try {
          updatedRecord = JSON.parse(responseText);
        } catch (e) {
          updatedRecord = payload;
        }
      } else {
        throw new Error(`Backend responded with status ${res.status}`);
      }
    } catch (backendError) {
      console.warn('Backend update failed, using memory storage:', backendError);
      updatedRecord = payload;
    }

    // Update memory storage
    memoryStorage = memoryStorage.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    );

    return NextResponse.json(updatedRecord);

  } catch (error: any) {
    console.error('Error in PUT knowledge base:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to update knowledge base record' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'delete' && id) {
      const idNum = parseInt(id);

      // Try to delete from backend
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/delete/${idNum}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Backend responded with status ${res.status}`);
        }
      } catch (backendError) {
        console.warn('Backend delete failed, using memory storage:', backendError);
      }

      // Remove from memory storage
      memoryStorage = memoryStorage.filter(record => record.id !== idNum);

      return NextResponse.json(
        { message: `Knowledge base record ${id} deleted successfully` },
        { status: 200 }
      );
    } else if (action === 'delete-all') {
      // Try to delete all from backend
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/delete/all`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Backend responded with status ${res.status}`);
        }
      } catch (backendError) {
        console.warn('Backend delete-all failed, using memory storage:', backendError);
      }

      // Clear memory storage
      memoryStorage = [];

      return NextResponse.json(
        { message: 'All knowledge base records deleted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid action parameter' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error in DELETE knowledge base:', error.message);
    return NextResponse.json(
      { message: error.message || 'Failed to delete knowledge base record' },
      { status: 500 }
    );
  }
}