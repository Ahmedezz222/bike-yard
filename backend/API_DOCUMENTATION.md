# Bike Yard API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
The API uses Laravel Sanctum for authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Description**: Register a new user account
- **Request Body**:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "US"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

#### Login User
- **POST** `/auth/login`
- **Description**: Authenticate user and get access token
- **Request Body**:
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

#### Logout User
- **POST** `/auth/logout`
- **Description**: Logout user and invalidate token
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

#### Get User Profile
- **GET** `/auth/profile`
- **Description**: Get authenticated user profile
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "phone": "+1234567890",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip_code": "10001",
        "country": "US"
    }
}
```

#### Update User Profile
- **PUT** `/auth/profile`
- **Description**: Update authenticated user profile
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
    "name": "John Smith",
    "phone": "+1234567891",
    "address": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zip_code": "90210",
    "country": "US"
}
```

#### Change Password
- **POST** `/auth/change-password`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
    "current_password": "oldpassword",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

#### Forgot Password
- **POST** `/auth/forgot-password`
- **Description**: Send password reset email
- **Request Body**:
```json
{
    "email": "john@example.com"
}
```

### Products

#### Get All Products
- **GET** `/products`
- **Description**: Get paginated list of products with filtering
- **Query Parameters**:
  - `category` (string): Filter by category
  - `featured` (boolean): Filter featured products
  - `min_price` (number): Minimum price filter
  - `max_price` (number): Maximum price filter
  - `search` (string): Search in name, description, brand, model
  - `in_stock` (boolean): Filter in-stock products
  - `sort_by` (string): Sort field (name, price, created_at)
  - `sort_order` (string): Sort order (asc, desc)
  - `per_page` (number): Items per page (default: 12)
- **Response**:
```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "name": "Mountain Bike Pro",
                "description": "Professional mountain bike...",
                "price": "899.99",
                "images": ["/products/Mountain_Bike.png"],
                "category": "Mountain Bikes",
                "stock": 15,
                "featured": true,
                "sku": "MTB-001"
            }
        ],
        "total": 10,
        "per_page": 12
    }
}
```

#### Get Featured Products
- **GET** `/products/featured`
- **Description**: Get featured products
- **Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Mountain Bike Pro",
            "featured": true
        }
    ]
}
```

#### Get Product Categories
- **GET** `/products/categories`
- **Description**: Get all product categories
- **Response**:
```json
{
    "success": true,
    "data": [
        "Mountain Bikes",
        "Road Bikes",
        "Electric Bikes",
        "Accessories"
    ]
}
```

#### Get Product by ID
- **GET** `/products/{id}`
- **Description**: Get specific product details
- **Response**:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Mountain Bike Pro",
        "description": "Professional mountain bike...",
        "price": "899.99",
        "images": ["/products/Mountain_Bike.png"],
        "category": "Mountain Bikes",
        "stock": 15,
        "featured": true,
        "sku": "MTB-001",
        "brand": "BikeYard",
        "model": "Pro Mountain",
        "year": 2024,
        "condition": "new",
        "warranty": "2 years"
    }
}
```

#### Search Products
- **GET** `/products/search?query={search_term}`
- **Description**: Search products by name, description, brand, or model
- **Response**: Same as Get All Products

#### Get Related Products
- **GET** `/products/{id}/related`
- **Description**: Get related products from same category
- **Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": 2,
            "name": "Mountain Bike Trail",
            "category": "Mountain Bikes"
        }
    ]
}
```

#### Get Product Stock Status
- **GET** `/products/{id}/stock`
- **Description**: Get product stock information
- **Response**:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Mountain Bike Pro",
        "stock": 15,
        "in_stock": true
    }
}
```

#### Get Products by Category
- **GET** `/products/category/{category}`
- **Description**: Get products filtered by category
- **Response**: Same as Get All Products

### Orders

#### Create Order
- **POST** `/orders`
- **Description**: Create a new order
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "items": [
        {
            "product_id": 1,
            "quantity": 2
        }
    ],
    "shipping_address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip_code": "10001",
        "country": "US"
    },
    "payment_method": "credit_card",
    "notes": "Please deliver after 6 PM"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "order": {
            "id": 1,
            "order_number": "ORD-1234567890-1234",
            "total_amount": "1009.99",
            "status": "pending"
        },
        "order_number": "ORD-1234567890-1234"
    }
}
```

#### Get User Orders
- **GET** `/orders/my-orders`
- **Description**: Get authenticated user's orders
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "order_number": "ORD-1234567890-1234",
                "total_amount": "1009.99",
                "status": "pending",
                "created_at": "2024-01-01T00:00:00.000000Z"
            }
        ]
    }
}
```

#### Get Order by ID
- **GET** `/orders/{id}`
- **Description**: Get specific order details
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "order_number": "ORD-1234567890-1234",
        "customer_name": "John Doe",
        "total_amount": "1009.99",
        "status": "pending",
        "items": [
            {
                "id": 1,
                "product_name": "Mountain Bike Pro",
                "quantity": 2,
                "unit_price": "899.99",
                "total_price": "1799.98"
            }
        ]
    }
}
```

#### Cancel Order
- **POST** `/orders/{id}/cancel`
- **Description**: Cancel an order
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
    "success": true,
    "message": "Order cancelled successfully"
}
```

#### Track Order (Public)
- **GET** `/orders/track/{order_number}`
- **Description**: Track order status (no authentication required)
- **Response**:
```json
{
    "success": true,
    "data": {
        "order_number": "ORD-1234567890-1234",
        "status": "shipped",
        "tracking_number": "TRK123456789",
        "carrier": "FedEx",
        "estimated_delivery": "2024-01-08T00:00:00.000000Z",
        "status_history": [
            {
                "status": "pending",
                "date": "2024-01-01T00:00:00.000000Z"
            }
        ]
    }
}
```

### Contact

#### Submit Contact Form
- **POST** `/contact`
- **Description**: Submit contact form (no authentication required)
- **Request Body**:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "Product Inquiry",
    "message": "I have a question about your mountain bikes."
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Message sent successfully. We will get back to you soon.",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "subject": "Product Inquiry",
        "status": "unread"
    }
}
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Dashboard Statistics
- **GET** `/admin/dashboard`
- **Description**: Get admin dashboard statistics
- **Headers**: `Authorization: Bearer {admin_token}`
- **Response**:
```json
{
    "success": true,
    "data": {
        "total_orders": 150,
        "total_products": 25,
        "total_users": 100,
        "total_revenue": "150000.00",
        "pending_orders": 15,
        "low_stock_products": 5,
        "recent_orders": [...],
        "top_products": [...]
    }
}
```

#### Admin Products Management
- **GET** `/admin/products` - Get all products with admin filters
- **POST** `/admin/products` - Create new product
- **PUT** `/admin/products/{id}` - Update product
- **DELETE** `/admin/products/{id}` - Delete product

#### Admin Orders Management
- **GET** `/admin/orders` - Get all orders with admin filters
- **PUT** `/admin/orders/{id}/status` - Update order status

#### Admin Users Management
- **GET** `/admin/users` - Get all users
- **PUT** `/admin/users/{id}/role` - Update user role

#### Admin Contact Management
- **GET** `/admin/contacts` - Get all contact messages
- **GET** `/admin/contacts/statistics` - Get contact statistics
- **GET** `/admin/contacts/{id}` - Get specific contact message
- **PUT** `/admin/contacts/{id}/status` - Update contact status
- **POST** `/admin/contacts/{id}/respond` - Respond to contact message
- **DELETE** `/admin/contacts/{id}` - Delete contact message

#### Sales Report
- **GET** `/admin/sales-report`
- **Description**: Get sales report with optional date filtering
- **Query Parameters**:
  - `period` (string): week, month, year
  - `start_date` (date): Custom start date
  - `end_date` (date): Custom end date
- **Response**:
```json
{
    "success": true,
    "data": {
        "total_sales": "50000.00",
        "total_orders": 100,
        "average_order_value": "500.00",
        "top_products": [
            {
                "product_name": "Mountain Bike Pro",
                "total_sold": 25
            }
        ]
    }
}
```

## Error Responses

### Validation Error (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    }
}
```

### Authentication Error (401)
```json
{
    "success": false,
    "message": "Authentication required"
}
```

### Authorization Error (403)
```json
{
    "success": false,
    "message": "Access denied. Admin privileges required."
}
```

### Not Found Error (404)
```json
{
    "success": false,
    "message": "Product not found"
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Internal server error"
}
```

## Testing the API

### Sample Admin Credentials
- **Email**: admin@bikeyard.com
- **Password**: password123

### Sample User Credentials
- **Email**: john@example.com
- **Password**: password123

### Testing with cURL

#### Login Example
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bikeyard.com",
    "password": "password123"
  }'
```

#### Get Products Example
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Content-Type: application/json"
```

#### Create Order Example
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

## Notes

1. All timestamps are in ISO 8601 format
2. Prices are returned as strings to maintain precision
3. Images are stored as arrays of URLs
4. The API supports pagination for list endpoints
5. Admin endpoints require both authentication and admin role
6. CORS is configured to allow all origins for development
7. Rate limiting is not implemented but can be added if needed 