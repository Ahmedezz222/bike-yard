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
Route::view('/forgot-password', 'auth-forgot-password');
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
Route::get('/admin/categories', function () {
    return view('categories');
});
Route::get('/admin/brands', function () {
    return view('brands');
});

Route::get('/products', function () {
    $products = \App\Models\Product::all();
    return view('public-products', compact('products'));
});

Route::get('/order-confirmation/{id}', function ($id) {
    // In a real application, you would fetch the order from the database
    // For now, we'll pass a sample order to the view
    $order = [
        'id' => $id,
        'order_number' => 'ORD-' . substr($id, -6),
        'status' => 'pending',
        'customer_name' => 'John Doe',
        'customer_email' => 'john@example.com',
        'created_at' => now(),
        'subtotal' => 580.00,
        'tax_amount' => 58.00,
        'total_amount' => 638.00,
        'shipping_address' => [
            'street' => '123 Main St',
            'city' => 'City',
            'state' => 'State',
            'zipCode' => '12345',
            'country' => 'United States'
        ],
        'items' => [
            [
                'product' => [
                    'name' => 'Mountain Bike',
                    'price' => 500.00,
                    'image' => '/products/Mountain_Bike.png'
                ],
                'quantity' => 1,
                'price' => 500.00
            ],
            [
                'product' => [
                    'name' => 'Cycling Helmet',
                    'price' => 40.00,
                    'image' => '/products/Accessories.png'
                ],
                'quantity' => 2,
                'price' => 40.00
            ]
        ]
    ];
    
    return view('order-confirmation', compact('order'));
});

// Authentication POST routes
Route::post('/signin', function (\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // For now, just redirect back with a success message
    // In a real application, you would implement actual authentication logic
    return redirect('/admin')->with('success', 'Signed in successfully!');
});

Route::post('/signup', function (\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
    ]);

    // Create new user
    $user = new \App\Models\User();
    $user->name = $validated['name'];
    $user->email = $validated['email'];
    $user->password = bcrypt($validated['password']);
    $user->save();

    return redirect('/signin')->with('success', 'Account created successfully! Please sign in.');
});

Route::post('/forgot-password', function (\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'email' => 'required|email|exists:users,email',
    ]);

    // For now, just redirect back with a success message
    // In a real application, you would implement actual password reset logic
    return back()->with('success', 'Password reset link sent to your email!');
});
