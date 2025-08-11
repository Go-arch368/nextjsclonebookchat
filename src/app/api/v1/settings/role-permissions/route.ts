import { NextResponse } from 'next/server';

// TypeScript interface for the role permission
interface RolePermission {
  id: number;
  userId: number;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory store for role permissions (replace with a database in production)
let rolePermissions: RolePermission[] = [];

// GET: Handle /all and /search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'all') {
      // GET /api/v1/settings/role-permissions?action=all
      return NextResponse.json(rolePermissions, { status: 200 });
    } else if (action === 'search') {
      // GET /api/v1/settings/role-permissions?action=search&keyword=...&page=...&size=...
      const keyword = searchParams.get('keyword')?.toLowerCase() || '';
      const page = parseInt(searchParams.get('page') || '0', 10);
      const size = parseInt(searchParams.get('size') || '10', 10);

      const filteredRolePermissions = rolePermissions.filter(
        (rolePermission) => rolePermission.userRole.toLowerCase().includes(keyword)
      );

      const start = page * size;
      const end = start + size;
      const paginatedRolePermissions = filteredRolePermissions.slice(start, end);

      return NextResponse.json(paginatedRolePermissions, { status: 200 });
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

    const body: RolePermission = await request.json();

    // Validate required fields
    if (!body.userRole?.trim()) {
      return NextResponse.json({ error: 'User role is required' }, { status: 400 });
    }

    // Check for duplicate user role
    if (rolePermissions.some((rp) => rp.userRole.toLowerCase() === body.userRole.toLowerCase())) {
      return NextResponse.json(
        { error: 'User role already exists' },
        { status: 400 }
      );
    }

    // Create new role permission
    const newRolePermission: RolePermission = {
      id: body.id || Date.now(), // Use provided ID or generate new one
      userId: body.userId || 1, // Default to 1 if not provided
      userRole: body.userRole,
      createdAt: body.createdAt || new Date().toISOString().slice(0, 19),
      updatedAt: new Date().toISOString().slice(0, 19),
    };

    rolePermissions.push(newRolePermission);

    return NextResponse.json(newRolePermission, { status: 201 });
  } catch (error) {
    console.error('Error creating role permission:', error);
    return NextResponse.json(
      { error: 'Failed to create role permission' },
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

    const body: RolePermission = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json({ error: 'Role permission ID is required' }, { status: 400 });
    }
    if (!body.userRole?.trim()) {
      return NextResponse.json({ error: 'User role is required' }, { status: 400 });
    }

    // Check for duplicate user role (excluding the current ID)
    if (rolePermissions.some((rp) => rp.userRole.toLowerCase() === body.userRole.toLowerCase() && rp.id !== body.id)) {
      return NextResponse.json(
        { error: 'User role already exists' },
        { status: 400 }
      );
    }

    // Find and update the role permission
    const index = rolePermissions.findIndex((rolePermission) => rolePermission.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Role permission not found' }, { status: 404 });
    }

    const updatedRolePermission: RolePermission = {
      ...rolePermissions[index],
      userRole: body.userRole,
      userId: body.userId || rolePermissions[index].userId,
      createdAt: body.createdAt || rolePermissions[index].createdAt,
      updatedAt: new Date().toISOString().slice(0, 19),
    };

    rolePermissions[index] = updatedRolePermission;

    return NextResponse.json(updatedRolePermission, { status: 200 });
  } catch (error) {
    console.error('Error updating role permission:', error);
    return NextResponse.json(
      { error: 'Failed to update role permission' },
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
      // DELETE /api/v1/settings/role-permissions?action=delete&id=...
      const id = parseInt(searchParams.get('id') || '0', 10);
      if (isNaN(id) || id === 0) {
        return NextResponse.json({ error: 'Invalid role permission ID' }, { status: 400 });
      }

      const index = rolePermissions.findIndex((rolePermission) => rolePermission.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'Role permission not found' }, { status: 404 });
      }

      rolePermissions.splice(index, 1);
      return NextResponse.json(
        { message: 'Role permission deleted successfully' },
        { status: 200 }
      );
    } else if (action === 'delete-all') {
      // DELETE /api/v1/settings/role-permissions?action=delete-all
      rolePermissions = [];
      return NextResponse.json(
        { message: 'All role permissions deleted successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}