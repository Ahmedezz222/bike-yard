<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

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