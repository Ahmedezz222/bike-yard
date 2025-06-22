<?php

require_once __DIR__.'/vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use Illuminate\Foundation\Application;

echo "Laravel Deployment Verification\n";
echo "==============================\n\n";

// Check if Laravel can bootstrap
try {
    $app = require_once __DIR__.'/bootstrap/app.php';
    echo "✓ Laravel application bootstrapped successfully\n";
} catch (Exception $e) {
    echo "✗ Laravel bootstrap failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Check environment file
if (file_exists(__DIR__.'/.env')) {
    echo "✓ .env file exists\n";
} else {
    echo "✗ .env file missing\n";
}

// Check application key
$key = $_ENV['APP_KEY'] ?? null;
if (!empty($key) && $key !== '') {
    echo "✓ Application key is set\n";
} else {
    echo "✗ Application key is missing\n";
}

// Check database connection (skip if SQLite is not available)
try {
    if (extension_loaded('pdo_sqlite')) {
        $connection = $app['db']->connection();
        echo "✓ Database connection successful\n";
    } else {
        echo "⚠ Database connection skipped (SQLite extension not available)\n";
    }
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n";
}

// Check storage permissions
$storagePath = __DIR__.'/storage';
if (is_writable($storagePath)) {
    echo "✓ Storage directory is writable\n";
} else {
    echo "✗ Storage directory is not writable\n";
}

// Check cache directory
$cachePath = __DIR__.'/bootstrap/cache';
if (is_writable($cachePath)) {
    echo "✓ Cache directory is writable\n";
} else {
    echo "✗ Cache directory is not writable\n";
}

// Check PHP extensions
$requiredExtensions = ['pdo', 'openssl', 'mbstring', 'tokenizer', 'xml', 'ctype', 'json'];
$missingExtensions = [];
foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $missingExtensions[] = $ext;
    }
}

if (empty($missingExtensions)) {
    echo "✓ All required PHP extensions are loaded\n";
} else {
    echo "⚠ Missing PHP extensions: " . implode(', ', $missingExtensions) . "\n";
}

echo "\nVerification completed!\n"; 