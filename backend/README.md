# Bike Yard - Laravel Backend API

A complete Laravel backend API for the Bike Yard e-commerce application. This backend provides all necessary endpoints for user authentication, product management, order processing, and admin functionality.

## Features

### 🔐 Authentication & Authorization
- User registration and login with Laravel Sanctum
- Role-based access control (Admin/User)
- Password management (change, forgot password)
- Profile management

### 🛍️ Product Management
- Complete CRUD operations for products
- Product categorization and filtering
- Search functionality
- Stock management
- Featured products
- Multiple image support

### 📦 Order Management
- Order creation and processing
- Order status tracking
- Order history for users
- Stock validation and updates
- Shipping address management

### 👨‍💼 Admin Panel
- Dashboard with statistics
- Product management interface
- Order management and status updates
- User management
- Contact form management
- Sales reports

### 📞 Contact Management
- Contact form submission
- Message management for admins
- Priority and status tracking
- Response system

### 🔍 Advanced Features
- Comprehensive filtering and search
- Pagination for all list endpoints
- Form validation with detailed error messages
- CORS configuration for frontend integration
- Database relationships and constraints
- Sample data seeding

## Technology Stack

- **Framework**: Laravel 12.x
- **Authentication**: Laravel Sanctum
- **Database**: MySQL/SQLite (configurable)
- **API**: RESTful JSON API
- **Validation**: Laravel Form Request Validation
- **Database**: Eloquent ORM with relationships

## Installation & Setup

### Prerequisites
- PHP 8.2 or higher
- Composer
- MySQL/SQLite database
- Web server (Apache/Nginx) or PHP built-in server

### 1. Clone and Install Dependencies
```bash
cd backend
composer install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

Update the `.env` file with your database configuration:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bike_yard
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 3. Database Setup
```bash
php artisan migrate:fresh --seed
```

This will:
- Create all necessary database tables
- Seed the database with sample data
- Create admin and test user accounts

### 4. Start the Development Server
```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## Database Structure

### Tables
- **users** - User accounts with roles
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **order_items** - Individual items in orders
- **contacts** - Contact form submissions

### Relationships
- Users have many Orders
- Products belong to Categories
- Orders have many OrderItems
- OrderItems belong to Products and Orders
- Contacts can be assigned to Users (admins)

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/products` - Get products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get categories
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Authentication Required)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders

### Admin Endpoints (Admin Role Required)
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/users` - Manage users
- `GET /api/admin/contacts` - Manage contacts

## Sample Data

The seeder creates the following sample data:

### Users
- **Admin**: admin@bikeyard.com / password123
- **User**: john@example.com / password123
- **User**: jane@example.com / password123

### Products
- Mountain Bikes (3 products)
- Road Bikes (2 products)
- Electric Bikes (1 product)
- Accessories (5 products)
- Clothing (1 product)

## Testing the API

### 1. Health Check
```bash
curl http://localhost:8000/api/health
```

### 2. Get Products
```bash
curl http://localhost:8000/api/products
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bikeyard.com", "password": "password123"}'
```

### 4. Create Order (with token)
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "items": [{"product_id": 1, "quantity": 1}],
    "shipping_address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip_code": "10001",
      "country": "US"
    }
  }'
```

### 5. Run Test Script
```bash
php test_api.php
```

## API Documentation

For complete API documentation with all endpoints, request/response examples, and error codes, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Security Features

- **Authentication**: Laravel Sanctum for secure token-based authentication
- **Authorization**: Role-based access control with middleware
- **Validation**: Comprehensive input validation for all endpoints
- **CORS**: Configured for cross-origin requests
- **SQL Injection Protection**: Eloquent ORM with parameterized queries
- **XSS Protection**: Laravel's built-in protection mechanisms

## Error Handling

The API returns consistent error responses:

```json
{
    "success": false,
    "message": "Error description",
    "errors": {
        "field": ["Validation error message"]
    }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Development

### Adding New Endpoints
1. Create controller method
2. Add route in `routes/api.php`
3. Add validation rules
4. Update API documentation

### Database Changes
1. Create migration: `php artisan make:migration migration_name`
2. Update model relationships if needed
3. Run migration: `php artisan migrate`

### Testing
- Use the provided test script: `php test_api.php`
- Test with Postman or similar API testing tool
- Verify all endpoints with the API documentation

## Deployment

### Production Considerations
1. Update `.env` with production database credentials
2. Set `APP_ENV=production`
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Configure web server (Apache/Nginx)
6. Set up proper file permissions
7. Configure caching (Redis recommended)

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SESSION_DOMAIN=your-domain.com
```

## Support

For issues or questions:
1. Check the API documentation
2. Review error logs in `storage/logs/`
3. Test with the provided test script
4. Verify database connections and migrations

## License

This project is part of the Bike Yard e-commerce application.
