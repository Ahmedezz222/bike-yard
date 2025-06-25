<?php

use Illuminate\Support\Facades\Route;

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

Route::post('/add-product', function () {
    // Handle product creation logic here
    return back()->with('success', 'Product added (not really, this is a placeholder).');
});
