<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'laravel_version' => app()->version(),
        'environment' => app()->environment()
    ]);
});

// Test API endpoint
Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel API is working!',
        'data' => [
            'framework' => 'Laravel',
            'version' => app()->version(),
            'php_version' => PHP_VERSION
        ]
    ]);
});

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

// Public product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/featured', [ProductController::class, 'featured']);
    Route::get('/categories', [ProductController::class, 'categories']);
    Route::get('/search', [ProductController::class, 'search']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::get('/{id}/related', [ProductController::class, 'related']);
    Route::get('/{id}/stock', [ProductController::class, 'stockStatus']);
    Route::get('/category/{category}', [ProductController::class, 'byCategory']);
});

// Public order tracking
Route::get('/orders/track/{orderNumber}', [OrderController::class, 'track']);

// Public contact form
Route::post('/contact', [ContactController::class, 'store']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // User profile routes
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Order routes
    Route::prefix('orders')->group(function () {
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/my-orders', [OrderController::class, 'userOrders']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::get('/number/{orderNumber}', [OrderController::class, 'byOrderNumber']);
        Route::post('/{id}/cancel', [OrderController::class, 'cancel']);
    });
});

// Admin routes (require admin privileges)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/sales-report', [AdminController::class, 'salesReport']);

    // Product management
    Route::prefix('products')->group(function () {
        Route::get('/', [AdminController::class, 'products']);
        Route::post('/', [AdminController::class, 'storeProduct']);
        Route::put('/{id}', [AdminController::class, 'updateProduct']);
        Route::delete('/{id}', [AdminController::class, 'deleteProduct']);
    });

    // Order management
    Route::prefix('orders')->group(function () {
        Route::get('/', [AdminController::class, 'orders']);
        Route::put('/{id}/status', [AdminController::class, 'updateOrderStatus']);
    });

    // User management
    Route::prefix('users')->group(function () {
        Route::get('/', [AdminController::class, 'users']);
        Route::put('/{id}/role', [AdminController::class, 'updateUserRole']);
    });

    // Contact management
    Route::prefix('contacts')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::get('/statistics', [ContactController::class, 'statistics']);
        Route::get('/{id}', [ContactController::class, 'show']);
        Route::put('/{id}/status', [ContactController::class, 'updateStatus']);
        Route::post('/{id}/respond', [ContactController::class, 'respond']);
        Route::delete('/{id}', [ContactController::class, 'destroy']);
    });
});

// Get authenticated user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'success' => true,
        'data' => $request->user()
    ]);
}); 