#!/bin/bash

# Exit on error
set -e

# Install PHP dependencies
cd backend
composer install --no-dev --optimize-autoloader

# Generate Laravel environment file
cp .env.example .env
php artisan key:generate
php artisan config:cache
php artisan route:cache

# Return to root directory
cd ..

# Install Node.js dependencies
npm install

# Build Next.js application
npm run build 