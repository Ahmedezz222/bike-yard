import { NextResponse } from 'next/server';
import { fetchFromJsonBin } from '@/app/lib/jsonbin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const orders = await fetchFromJsonBin('orders');
    
    // Try to find the order by exact ID match first
    let order = orders.find((o: any) => o._id === orderId);
    
    // If not found, try to find by the last 6 characters of the ID
    if (!order) {
      const shortId = orderId.slice(-6);
      order = orders.find((o: any) => o._id.endsWith(shortId));
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 