import { NextResponse } from 'next/server';
import { fetchFromJsonBin } from '@/app/lib/jsonbin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orders = await fetchFromJsonBin('orders');
    const order = orders.find((o: any) => o._id === params.id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
} 