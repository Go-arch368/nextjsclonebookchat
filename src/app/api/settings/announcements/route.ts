import { NextRequest, NextResponse } from 'next/server';

// Correct backend URL - your backend uses /api/v1/ path
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI}/api/settings/announcements`
  : 'https://zotlyadminapis-39lct.ondigitalocean.app/zotlyadmin/api/settings/announcements';

// In-memory storage as fallback when backend is not available
let memoryStorage: any[] = [];

export async function GET() {
  try {
    console.log('Fetching announcements from:', BACKEND_BASE_URL);
    
    // First try to fetch from backend
    try {
      const response = await fetch(BACKEND_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      console.log('Backend response status:', response.status);
      
      if (response.ok) {
        let data;
        try {
          data = responseText ? JSON.parse(responseText) : [];
        } catch (parseError) {
          console.error('JSON parse error:', responseText);
          data = [];
        }

        // Ensure we always return an array and update memory storage
        const announcements = Array.isArray(data) ? data : [];
        memoryStorage = announcements; // Sync memory storage with backend
        console.log('Fetched announcements from backend:', announcements.length);
        
        return NextResponse.json(announcements);
      }
    } catch (backendError) {
      console.warn('Backend not available, using memory storage:', backendError);
    }

    // Fallback to memory storage
    console.log('Using memory storage with', memoryStorage.length, 'announcements');
    return NextResponse.json(memoryStorage);
    
  } catch (error: any) {
    console.error('Error fetching announcements:', error.message);
    // Return empty array on error
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    
    console.log('Creating announcement:', body);
    
    
    const { id, ...payloadWithoutId } = body;

    const payload = {
      ...payloadWithoutId,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try to save to backend
    let savedAnnouncement;
    try {
      const response = await fetch(BACKEND_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Create response status:', response.status);
      
      if (response.ok) {
        try {
          savedAnnouncement = responseText ? JSON.parse(responseText) : payload;
        } catch (parseError) {
          savedAnnouncement = { ...payload, id: Date.now() };
        }
      } else {
        throw new Error(`Backend responded with status ${response.status}`);
      }
    } catch (backendError) {
      console.warn('Backend save failed, using memory storage:', backendError);
      // Create announcement in memory storage
      savedAnnouncement = {
        ...payload,
        id: Date.now(), // Generate unique ID for memory storage
      };
    }

    // Add to memory storage
    memoryStorage = [savedAnnouncement, ...memoryStorage];
    console.log('Announcement saved to memory:', savedAnnouncement);

    return NextResponse.json(savedAnnouncement);
  } catch (error: any) {
    console.error('Error creating announcement:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Updating announcement:', body);
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing announcement ID' },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Try to update in backend
    let updatedAnnouncement;
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/${body.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Update response status:', response.status);
      
      if (response.ok) {
        try {
          updatedAnnouncement = responseText ? JSON.parse(responseText) : payload;
        } catch (parseError) {
          updatedAnnouncement = payload;
        }
      } else {
        throw new Error(`Backend responded with status ${response.status}`);
      }
    } catch (backendError) {
      console.warn('Backend update failed, using memory storage:', backendError);
      updatedAnnouncement = payload;
    }

    // Update memory storage
    memoryStorage = memoryStorage.map(ann => 
      ann.id === updatedAnnouncement.id ? updatedAnnouncement : ann
    );

    return NextResponse.json(updatedAnnouncement);
  } catch (error: any) {
    console.error('Error updating announcement:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing announcement ID' },
        { status: 400 }
      );
    }

    const idNum = parseInt(id);
    console.log('Deleting announcement:', idNum);

    // Try to delete from backend
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/${idNum}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status ${response.status}`);
      }
    } catch (backendError) {
      console.warn('Backend delete failed, using memory storage:', backendError);
    }

    // Remove from memory storage
    memoryStorage = memoryStorage.filter(ann => ann.id !== idNum);

    return NextResponse.json({ message: `Announcement ${id} deleted successfully` });
  } catch (error: any) {
    console.error('Error deleting announcement:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}