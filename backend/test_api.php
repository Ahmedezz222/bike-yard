<?php

// Simple API test script
$baseUrl = 'http://localhost:8000/api';

echo "Testing Bike Yard API...\n\n";

// Test 1: Health check
echo "1. Testing health check...\n";
$response = file_get_contents($baseUrl . '/health');
$data = json_decode($response, true);
if ($data['status'] === 'healthy') {
    echo "✓ Health check passed\n";
} else {
    echo "✗ Health check failed\n";
}

// Test 2: Get products
echo "\n2. Testing products endpoint...\n";
$response = file_get_contents($baseUrl . '/products');
$data = json_decode($response, true);
if ($data['success'] && isset($data['data']['data'])) {
    echo "✓ Products endpoint working - Found " . count($data['data']['data']) . " products\n";
} else {
    echo "✗ Products endpoint failed\n";
}

// Test 3: Get featured products
echo "\n3. Testing featured products...\n";
$response = file_get_contents($baseUrl . '/products/featured');
$data = json_decode($response, true);
if ($data['success'] && isset($data['data'])) {
    echo "✓ Featured products working - Found " . count($data['data']) . " featured products\n";
} else {
    echo "✗ Featured products failed\n";
}

// Test 4: Get categories
echo "\n4. Testing categories endpoint...\n";
$response = file_get_contents($baseUrl . '/products/categories');
$data = json_decode($response, true);
if ($data['success'] && isset($data['data'])) {
    echo "✓ Categories endpoint working - Found " . count($data['data']) . " categories\n";
} else {
    echo "✗ Categories endpoint failed\n";
}

// Test 5: Test authentication
echo "\n5. Testing authentication...\n";
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode([
            'email' => 'admin@bikeyard.com',
            'password' => 'password123'
        ])
    ]
]);

$response = file_get_contents($baseUrl . '/auth/login', false, $context);
$data = json_decode($response, true);

if ($data['success'] && isset($data['data']['token'])) {
    echo "✓ Authentication working - Got token\n";
    $token = $data['data']['token'];
    
    // Test 6: Test admin dashboard
    echo "\n6. Testing admin dashboard...\n";
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Authorization: Bearer ' . $token
        ]
    ]);
    
    $response = file_get_contents($baseUrl . '/admin/dashboard', false, $context);
    $data = json_decode($response, true);
    
    if ($data['success'] && isset($data['data']['total_products'])) {
        echo "✓ Admin dashboard working\n";
    } else {
        echo "✗ Admin dashboard failed\n";
    }
} else {
    echo "✗ Authentication failed\n";
}

echo "\nAPI testing completed!\n"; 