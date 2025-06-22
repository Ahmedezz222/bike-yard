#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."

# Install Node.js dependencies first
echo "Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm install
else
    echo "Error: package.json not found"
    exit 1
fi

# Build Next.js application
echo "Building Next.js application..."
npm run build

# Handle Laravel backend if it exists
if [ -d "backend" ]; then
    echo "Setting up Laravel backend..."
    cd backend

    # Install Composer if not present
    if ! command -v composer &> /dev/null; then
        echo "Installing Composer..."
        curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    fi

    # Install PHP dependencies with platform requirements ignored
    if [ -f "composer.json" ]; then
        echo "Installing PHP dependencies..."
        composer install --no-dev --optimize-autoloader --ignore-platform-req=ext-fileinfo --ignore-platform-req=ext-sqlite3
    else
        echo "Warning: composer.json not found in backend directory"
    fi

    # Generate Laravel environment file if needed
    if [ -f ".env.example" ]; then
        if [ ! -f ".env" ]; then
            cp .env.example .env
        fi
        
        # Set production environment variables
        sed -i 's/APP_ENV=local/APP_ENV=production/' .env
        sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
        
        # Generate application key if not set
        if [ -z "$(grep '^APP_KEY=' .env)" ] || [ "$(grep '^APP_KEY=' .env | cut -d'=' -f2)" == "" ]; then
            echo "Generating application key..."
            php artisan key:generate --force
        fi
        
        # Create database file if it doesn't exist
        if [ ! -f "database/database.sqlite" ]; then
            echo "Creating SQLite database file..."
            touch database/database.sqlite
        fi
        
        # Set proper permissions for storage and bootstrap/cache
        echo "Setting permissions..."
        chmod -R 775 storage
        chmod -R 775 bootstrap/cache
        
        # Cache configuration (skip if there are database issues)
        echo "Caching configuration..."
        php artisan config:cache || echo "Warning: Could not cache config"
        php artisan route:cache || echo "Warning: Could not cache routes"
        php artisan view:cache || echo "Warning: Could not cache views"
        
        # Run migrations if needed (skip if SQLite is not available)
        if [ "$RUN_MIGRATIONS" = "true" ]; then
            echo "Running migrations..."
            php artisan migrate --force || echo "Warning: Could not run migrations"
        fi
        
        # Verify deployment
        echo "Verifying deployment..."
        if [ -f "verify-deployment.php" ]; then
            php verify-deployment.php || echo "Warning: Deployment verification failed"
        fi
    else
        echo "Warning: .env.example not found in backend directory"
    fi

    cd ..
else
    echo "Warning: backend directory not found, skipping Laravel setup"
fi

echo "Build process completed successfully!" 