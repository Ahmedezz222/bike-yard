import { NextResponse } from 'next/server';
import { fetchFromJsonBin, updateJsonBin } from '@/app/lib/jsonbin';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

// GET all orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const orders = await fetchFromJsonBin('orders') as Order[];

    // Apply filters
    let filteredOrders = [...orders];

    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST new order
export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const orders = await fetchFromJsonBin('orders') as Order[];

    // Generate a more URL-friendly ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const newId = `ORD-${timestamp}-${random}`;
    
    const newOrder: Order = {
      ...orderData,
      _id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Validate required fields
    if (!newOrder.customerName || !newOrder.customerEmail || !newOrder.items || newOrder.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order information' },
        { status: 400 }
      );
    }

    orders.push(newOrder);
    await updateJsonBin('orders', orders);

    return NextResponse.json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT update order
export async function PUT(request: Request) {
  try {
    const updatedOrder = await request.json();
    const orders = await fetchFromJsonBin('orders') as Order[];

    const index = orders.findIndex((o: Order) => o._id === updatedOrder._id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    orders[index] = {
      ...updatedOrder,
      updatedAt: new Date().toISOString(),
    };

    await updateJsonBin('orders', orders);
    return NextResponse.json(orders[index]);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const orders = await fetchFromJsonBin('orders') as Order[];
    const filteredOrders = orders.filter((o: Order) => o._id !== id);

    if (filteredOrders.length === orders.length) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    await updateJsonBin('orders', filteredOrders);
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 