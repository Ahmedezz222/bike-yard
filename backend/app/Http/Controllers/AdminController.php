<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function dashboard()
    {
        $stats = [
            'total_orders' => Order::count(),
            'total_products' => Product::count(),
            'total_users' => User::count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'low_stock_products' => Product::where('stock', '<', 10)->count(),
            'recent_orders' => Order::with('items')->latest()->take(5)->get(),
            'top_products' => Product::withCount('orderItems')->orderBy('order_items_count', 'desc')->take(5)->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get all products with admin features
     */
    public function products(Request $request)
    {
        $query = Product::query();

        // Apply filters
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        if ($request->has('featured') && $request->featured !== null) {
            $query->where('featured', $request->boolean('featured'));
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->has('stock_status')) {
            if ($request->stock_status === 'in_stock') {
                $query->where('stock', '>', 0);
            } elseif ($request->stock_status === 'out_of_stock') {
                $query->where('stock', '<=', 0);
            } elseif ($request->stock_status === 'low_stock') {
                $query->where('stock', '<', 10)->where('stock', '>', 0);
            }
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Create new product
     */
    public function storeProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'category' => 'required|string|max:100',
            'stock' => 'required|integer|min:0',
            'featured' => 'boolean',
            'sku' => 'nullable|string|unique:products,sku',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'brand' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'condition' => 'nullable|in:new,used,refurbished',
            'warranty' => 'nullable|string|max:255',
            'shipping_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    /**
     * Update product
     */
    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'category' => 'sometimes|required|string|max:100',
            'stock' => 'sometimes|required|integer|min:0',
            'featured' => 'boolean',
            'sku' => 'nullable|string|unique:products,sku,' . $id,
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'brand' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'condition' => 'nullable|in:new,used,refurbished',
            'warranty' => 'nullable|string|max:255',
            'shipping_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    /**
     * Delete product
     */
    public function deleteProduct($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Get all orders with admin features
     */
    public function orders(Request $request)
    {
        $query = Order::with('items', 'user');

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $orders = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|required|in:pending,paid,failed,refunded',
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

        $order->update($request->all());
        $order->updateStatus($request->status, $request->notes);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => $order
        ]);
    }

    /**
     * Get all users
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Update user role
     */
    public function updateUserRole(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|in:user,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'success' => true,
            'message' => 'User role updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Get sales report
     */
    public function salesReport(Request $request)
    {
        $period = $request->get('period', 'month');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $query = Order::where('payment_status', 'paid');

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        } else {
            switch ($period) {
                case 'week':
                    $query->where('created_at', '>=', now()->subWeek());
                    break;
                case 'month':
                    $query->where('created_at', '>=', now()->subMonth());
                    break;
                case 'year':
                    $query->where('created_at', '>=', now()->subYear());
                    break;
            }
        }

        $report = [
            'total_sales' => $query->sum('total_amount'),
            'total_orders' => $query->count(),
            'average_order_value' => $query->avg('total_amount'),
            'top_products' => DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.payment_status', 'paid')
                ->select('order_items.product_name', DB::raw('SUM(order_items.quantity) as total_sold'))
                ->groupBy('order_items.product_name')
                ->orderBy('total_sold', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $report
        ]);
    }
}
