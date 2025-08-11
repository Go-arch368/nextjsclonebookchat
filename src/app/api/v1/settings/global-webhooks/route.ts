import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface GlobalWebhook {
  id: number;
  userId: number;
  event: string;
  dataTypeEnabled: boolean;
  destination: 'TARGET_URL' | 'EMAIL' | 'BOTH';
  email: string;
  targetUrl: string;
  createdBy: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URI || 'https://zotly.onrender.com';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const keyword = searchParams.get('keyword');

  try {
    if (action === 'list') {
      const response = await axios.get<GlobalWebhook[]>(`${API_BASE_URL}/api/v1/settings/global-webhooks`);
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      return NextResponse.json(response.data);
    } else if (action === 'search' && keyword) {
      const response = await axios.get<GlobalWebhook[]>(
        `${API_BASE_URL}/api/v1/settings/global-webhooks/search?keyword=${encodeURIComponent(keyword)}`
      );
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array');
      }
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { message: 'Invalid action or missing keyword' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error(`Error in GET /${action || 'unknown'}:`, error.message, error.stack);
    const message =
      error.response?.status === 404
        ? 'Global Webhooks API route not found. Please check the server configuration.'
        : error.response?.data?.message || error.message || 'Failed to fetch global webhooks';
    return NextResponse.json({ message }, { status: error.response?.status || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (
      !body.event ||
      !body.destination ||
      !body.createdBy ||
      !body.company ||
      (body.destination === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) ||
      (body.destination === 'TARGET_URL' && !body.targetUrl) ||
      (body.destination === 'BOTH' && (!body.email || !body.targetUrl))
    ) {
      return NextResponse.json(
        { message: 'Missing or invalid required fields: event, destination, email (for EMAIL/BOTH), targetUrl (for TARGET_URL/BOTH), createdBy, company' },
        { status: 400 }
      );
    }

    if (body.destination === 'TARGET_URL' || body.destination === 'BOTH') {
      try {
        new URL(body.targetUrl);
      } catch {
        return NextResponse.json(
          { message: 'Invalid targetUrl format' },
          { status: 400 }
        );
      }
    }

    const response = await axios.post<GlobalWebhook>(
      `${API_BASE_URL}/api/v1/settings/global-webhooks`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in POST:', error.message, error.stack);
    const message =
      error.response?.status === 404
        ? 'Global Webhooks API route not found. Please check the server configuration.'
        : error.response?.status === 405
        ? 'Method not allowed. Please check the API configuration.'
        : error.response?.data?.message || error.message || 'Failed to add global webhook';
    return NextResponse.json({ message }, { status: error.response?.status || 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (
      !body.id ||
      !body.event ||
      !body.destination ||
      !body.createdBy ||
      !body.company ||
      (body.destination === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) ||
      (body.destination === 'TARGET_URL' && !body.targetUrl) ||
      (body.destination === 'BOTH' && (!body.email || !body.targetUrl))
    ) {
      return NextResponse.json(
        { message: 'Missing or invalid required fields: id, event, destination, email (for EMAIL/BOTH), targetUrl (for TARGET_URL/BOTH), createdBy, company' },
        { status: 400 }
      );
    }

    if (body.destination === 'TARGET_URL' || body.destination === 'BOTH') {
      try {
        new URL(body.targetUrl);
      } catch {
        return NextResponse.json(
          { message: 'Invalid targetUrl format' },
          { status: 400 }
        );
      }
    }

    const response = await axios.put<GlobalWebhook>(
      `${API_BASE_URL}/api/v1/settings/global-webhooks`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in PUT:', error.message, error.stack);
    const message =
      error.response?.status === 404
        ? 'Global Webhooks API route not found. Please check the server configuration.'
        : error.response?.status === 405
        ? 'Method not allowed. Please check the API configuration.'
        : error.response?.data?.message || error.message || 'Failed to update global webhook';
    return NextResponse.json({ message }, { status: error.response?.status || 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');

  try {
    if (action === 'clear') {
      await axios.delete(`${API_BASE_URL}/api/v1/settings/global-webhooks/clear`);
      return NextResponse.json({ message: 'All global webhooks cleared successfully' });
    } else if (id) {
      await axios.delete(`${API_BASE_URL}/api/v1/settings/global-webhooks/${id}`);
      return NextResponse.json({ message: `Global webhook ${id} deleted successfully` });
    } else {
      return NextResponse.json(
        { message: 'Invalid delete request: specify "action=clear" or "id=<id>"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error(`Error in DELETE /${action || id || 'unknown'}:`, error.message, error.stack);
    const message =
      error.response?.status === 404
        ? 'Global Webhooks API route not found. Please check the server configuration.'
        : error.response?.status === 405
        ? 'Method not allowed. Please check the API configuration.'
        : error.response?.data?.message || error.message || 'Failed to delete global webhook';
    return NextResponse.json({ message }, { status: error.response?.status || 500 });
  }
}