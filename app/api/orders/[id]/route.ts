import { NextResponse } from 'next/server';
import { fetchFromJsonBin } from '@/app/lib/jsonbin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: Fetching order with ID:', params.id);
    
    const orders = await fetchFromJsonBin('orders');
    console.log('API: Total orders found:', orders.length);
    
    // Try to find the order by exact ID match first
    let order = orders.find((o: any) => o._id === params.id);
    
    // If not found, try to find by the last 6 characters of the ID
    if (!order) {
      const shortId = params.id.slice(-6);
      order = orders.find((o: any) => o._id.endsWith(shortId));
    }

    console.log('API: Order found:', order ? 'Yes' : 'No');

    if (!order) {
      console.log('API: Order not found for ID:', params.id);
      return NextResponse.json(
        { error: 'Order not found. Please check the order ID and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('API: Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order. Please try again later.' },
      { status: 500 }
    );
  }
} 