<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return view('home');
});

// Health check route for deployment verification
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'laravel_version' => app()->version()
    ]);
});

Route::view('/products', 'products');
Route::view('/cart', 'cart');
Route::view('/gallery', 'gallery');
Route::view('/contact', 'contact');
Route::view('/admin', 'admin');
Route::view('/signin', 'auth-signin');
Route::view('/signup', 'auth-signup');
Route::view('/order-confirmation', 'order-confirmation');

Route::get('/add-product', function () {
    return view('add-product');
});

Route::post('/add-product', function (\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'category' => 'required|string|max:100',
        'price' => 'required|numeric|min:0',
        'description' => 'required|string',
        'brand' => 'nullable|string|max:100',
        'model' => 'nullable|string|max:100',
        'year' => 'nullable|integer|min:1900|max:2100',
        'stock' => 'required|integer|min:0',
        'condition' => 'nullable|in:new,used,refurbished',
        'warranty' => 'nullable|string|max:255',
        'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    // Handle image upload
    $imagePath = null;
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageName = time() . '-' . uniqid() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('uploads'), $imageName);
        $imagePath = '/uploads/' . $imageName;
    }

    // Save product
    $product = new \App\Models\Product();
    $product->name = $validated['name'];
    $product->category = $validated['category'];
    $product->price = $validated['price'];
    $product->description = $validated['description'];
    $product->brand = $validated['brand'] ?? null;
    $product->model = $validated['model'] ?? null;
    $product->year = $validated['year'] ?? null;
    $product->stock = $validated['stock'];
    $product->condition = $validated['condition'] ?? 'new';
    $product->warranty = $validated['warranty'] ?? null;
    $product->images = $imagePath ? [$imagePath] : [];
    $product->featured = false;
    $product->save();

    return back()->with('success', 'Product added successfully!');
});

// Admin panel routes
Route::get('/admin', function () {
    return view('admin');
});
Route::get('/admin/products', function () {
    $products = \App\Models\Product::all();
    return view('products', compact('products'));
});
Route::get('/admin/orders', function () {
    $orders = \App\Models\Order::with('user')->get();
    return view('order-management', compact('orders'));
});
Route::get('/admin/users', function () {
    $users = \App\Models\User::all();
    return view('user-management', compact('users'));
});

Route::get('/products', function () {
    $products = \App\Models\Product::all();
    return view('public-products', compact('products'));
});
