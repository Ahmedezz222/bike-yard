<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|string|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'shipping_address.street' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.state' => 'required|string|max:100',
            'shipping_address.zip_code' => 'nullable|string|max:20',
            'shipping_address.country' => 'nullable|string|max:100',
            'billing_address' => 'nullable|array',
            'payment_method' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Calculate totals
            $subtotal = 0;
            $items = [];

            foreach ($request->items as $itemData) {
                $product = Product::find($itemData['product_id']);
                
                if (!$product || $product->stock < $itemData['quantity']) {
                    throw new \Exception("Product {$product->name} is out of stock or insufficient quantity");
                }

                $itemTotal = $product->price * $itemData['quantity'];
                $subtotal += $itemTotal;

                $items[] = [
                    'product' => $product,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $itemTotal,
                ];

                // Update stock
                $product->decrement('stock', $itemData['quantity']);
            }

            // Calculate tax and shipping (simplified)
            $taxAmount = $subtotal * 0.1; // 10% tax
            $shippingAmount = 15.00; // Fixed shipping
            $totalAmount = $subtotal + $taxAmount + $shippingAmount;

            // Create order
            $order = Order::create([
                'user_id' => $request->user()?->id,
                'order_number' => 'ORD-' . time() . '-' . rand(1000, 9999),
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'total_amount' => $totalAmount,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'shipping_amount' => $shippingAmount,
                'discount_amount' => 0,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address ?? $request->shipping_address,
                'notes' => $request->notes,
                'estimated_delivery' => now()->addDays(7),
            ]);

            // Create order items
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'product_name' => $item['product']->name,
                    'product_sku' => $item['product']->sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                    'product_data' => $item['product']->toArray(),
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => [
                    'order' => $order->load('items'),
                    'order_number' => $order->order_number,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order by ID
     */
    public function show($id)
    {
        $order = Order::with('items.product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Get order by order number
     */
    public function byOrderNumber($orderNumber)
    {
        $order = Order::with('items.product')->where('order_number', $orderNumber)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Get user's orders
     */
    public function userOrders(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required'
            ], 401);
        }

        $orders = Order::where('user_id', $user->id)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string|max:100',
            'carrier' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->update([
            'status' => $request->status,
            'tracking_number' => $request->tracking_number,
            'carrier' => $request->carrier,
            'notes' => $request->notes,
        ]);

        $order->updateStatus($request->status, $request->notes);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => $order
        ]);
    }

    /**
     * Cancel order
     */
    public function cancel($id)
    {
        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        if ($order->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Order is already cancelled'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Restore product stock
            foreach ($order->items as $item) {
                if ($item->product_id) {
                    Product::where('id', $item->product_id)
                        ->increment('stock', $item->quantity);
                }
            }

            $order->updateStatus('cancelled', 'Order cancelled by customer');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Track order
     */
    public function track($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'tracking_number' => $order->tracking_number,
                'carrier' => $order->carrier,
                'estimated_delivery' => $order->estimated_delivery,
                'status_history' => $order->status_history,
                'shipping_address' => $order->shipping_address,
            ]
        ]);
    }
}
