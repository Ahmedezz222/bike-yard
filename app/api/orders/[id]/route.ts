import { NextResponse } from 'next/server';
import { fetchFromJsonBin } from '@/app/lib/jsonbin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching order with ID:', params.id);
    const orders = await fetchFromJsonBin('orders');
    console.log('Fetched orders:', orders);
    
    if (!Array.isArray(orders)) {
      console.error('Invalid orders data:', orders);
      return NextResponse.json(
        { error: 'Invalid orders data format' },
        { status: 500 }
      );
    }

    // Log all order IDs for debugging
    console.log('Available order IDs:', orders.map((o: any) => o._id));

    // Try to find the order by exact ID match first
    const searchId = String(params.id).trim();
    let order = orders.find((o: any) => {
      if (!o?._id) return false;
      const orderId = String(o._id).trim();
      console.log('Comparing:', { orderId, searchId, match: orderId === searchId });
      return orderId === searchId;
    });
    
    // If not found, try to find by the last 6 characters of the ID
    if (!order) {
      const shortId = searchId.slice(-6);
      console.log('Trying short ID match:', shortId);
      order = orders.find((o: any) => {
        if (!o?._id) return false;
        const orderId = String(o._id).trim();
        const match = orderId.endsWith(shortId);
        console.log('Comparing short ID:', { orderId, shortId, match });
        return match;
      });
    }

    if (!order) {
      console.log('Order not found. Search ID:', searchId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Found order:', order);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
} 