<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Get all products with filtering and pagination
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Apply filters
        if ($request->has('category') && $request->category) {
            $query->byCategory($request->category);
        }

        if ($request->has('featured') && $request->featured !== null) {
            $query->where('featured', $request->boolean('featured'));
        }

        if ($request->has('min_price') && $request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && $request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
            });
        }

        if ($request->has('in_stock') && $request->boolean('in_stock')) {
            $query->inStock();
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get featured products
     */
    public function featured()
    {
        $products = Product::featured()->inStock()->take(6)->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get product by ID
     */
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Get products by category
     */
    public function byCategory($category)
    {
        $products = Product::byCategory($category)->inStock()->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get product categories
     */
    public function categories()
    {
        $categories = Product::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Search products
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = $request->query;
        $products = Product::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->orWhere('brand', 'like', "%{$query}%")
            ->orWhere('model', 'like', "%{$query}%")
            ->inStock()
            ->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get related products
     */
    public function related($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $relatedProducts = Product::where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->inStock()
            ->take(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $relatedProducts
        ]);
    }

    /**
     * Get product stock status
     */
    public function stockStatus($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => $product->stock,
                'in_stock' => $product->isInStock(),
            ]
        ]);
    }
}
