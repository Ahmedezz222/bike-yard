<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Bike Yard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .confirmation-header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 3rem 0;
            margin-bottom: 2rem;
        }
        .confirmation-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .status-badge {
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #cce5ff; color: #004085; }
        .status-shipped { background: #d1ecf1; color: #0c5460; }
        .status-delivered { background: #d4edda; color: #155724; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        .order-item {
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
            transition: box-shadow 0.3s ease;
        }
        .order-item:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }
        .timeline {
            position: relative;
            padding-left: 2rem;
        }
        .timeline::before {
            content: '';
            position: absolute;
            left: 0.5rem;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e9ecef;
        }
        .timeline-item {
            position: relative;
            margin-bottom: 1.5rem;
        }
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -1.5rem;
            top: 0.25rem;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #28a745;
            border: 3px solid white;
            box-shadow: 0 0 0 2px #e9ecef;
        }
        .timeline-item.completed::before {
            background: #28a745;
        }
        .timeline-item.current::before {
            background: #ffc107;
        }
        .timeline-item.pending::before {
            background: #e9ecef;
        }
        .print-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 10px;
            padding: 0.75rem 1.5rem;
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
            .confirmation-card { box-shadow: none !important; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="confirmation-header">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1 class="display-5 fw-bold mb-3">
                        <i class="bi bi-check-circle me-3"></i>Order Confirmed!
                    </h1>
                    <p class="lead mb-0">Thank you for your purchase. Your order has been successfully placed.</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm no-print">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/">
                <i class="bi bi-bicycle me-2"></i>Bike Yard
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="/">Home</a>
                <a class="nav-link" href="/products">Products</a>
                <a class="nav-link" href="/contact">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Order Details -->
    <main class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="confirmation-card">
                    <div class="card-body p-4">
                        <!-- Order Header -->
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h2 class="h4 mb-2">Order #{{ $order->order_number ?? 'ORD-' . substr($order->id ?? '123456', -6) }}</h2>
                                <p class="text-muted mb-0">Placed on {{ $order->created_at ?? now()->format('F j, Y \a\t g:i A') }}</p>
                            </div>
                            <div class="col-md-6 text-md-end">
                                <span class="status-badge status-{{ $order->status ?? 'pending' }}">
                                    {{ ucfirst($order->status ?? 'pending') }}
                                </span>
                            </div>
                        </div>

                        <!-- Order Status Timeline -->
                        <div class="mb-4">
                            <h3 class="h5 mb-3">Order Status</h3>
                            <div class="timeline">
                                <div class="timeline-item completed">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <strong>Order Placed</strong>
                                            <p class="text-muted mb-0 small">{{ $order->created_at ?? now()->format('M j, Y g:i A') }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="timeline-item {{ ($order->status ?? 'pending') == 'processing' ? 'current' : (in_array($order->status ?? 'pending', ['shipped', 'delivered']) ? 'completed' : 'pending') }}">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <strong>Processing</strong>
                                            <p class="text-muted mb-0 small">Your order is being prepared</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="timeline-item {{ ($order->status ?? 'pending') == 'shipped' ? 'current' : (($order->status ?? 'pending') == 'delivered' ? 'completed' : 'pending') }}">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <strong>Shipped</strong>
                                            @if($order->tracking_number ?? false)
                                                <p class="text-muted mb-0 small">Tracking: {{ $order->tracking_number }}</p>
                                            @else
                                                <p class="text-muted mb-0 small">Will be shipped soon</p>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                                <div class="timeline-item {{ ($order->status ?? 'pending') == 'delivered' ? 'completed' : 'pending' }}">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <strong>Delivered</strong>
                                            <p class="text-muted mb-0 small">Package delivered to your address</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Customer Information -->
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h3 class="h5 mb-3">Customer Information</h3>
                                <p class="mb-1"><strong>Name:</strong> {{ $order->customer_name ?? 'John Doe' }}</p>
                                <p class="mb-1"><strong>Email:</strong> {{ $order->customer_email ?? 'john@example.com' }}</p>
                                @if($order->customer_phone ?? false)
                                    <p class="mb-0"><strong>Phone:</strong> {{ $order->customer_phone }}</p>
                                @endif
                            </div>
                            <div class="col-md-6">
                                <h3 class="h5 mb-3">Shipping Address</h3>
                                @if($order->shipping_address ?? false)
                                    <p class="mb-1">{{ $order->shipping_address['street'] ?? '123 Main St' }}</p>
                                    <p class="mb-1">{{ $order->shipping_address['city'] ?? 'City' }}, {{ $order->shipping_address['state'] ?? 'State' }} {{ $order->shipping_address['zipCode'] ?? '12345' }}</p>
                                    <p class="mb-0">{{ $order->shipping_address['country'] ?? 'United States' }}</p>
                                @else
                                    <p class="mb-1">123 Main St</p>
                                    <p class="mb-1">City, State 12345</p>
                                    <p class="mb-0">United States</p>
                                @endif
                            </div>
                        </div>

                        <!-- Order Items -->
                        <div class="mb-4">
                            <h3 class="h5 mb-3">Order Items</h3>
                            @if($order->items ?? false)
                                @foreach($order->items as $item)
                                    <div class="order-item">
                                        <div class="row align-items-center">
                                            <div class="col-md-2">
                                                <img src="{{ $item->product->images[0] ?? '/products/Mountain_Bike.png' }}" 
                                                     alt="{{ $item->product->name ?? 'Product' }}" 
                                                     class="item-image"
                                                     onerror="this.src='/products/Mountain_Bike.png'">
                                            </div>
                                            <div class="col-md-6">
                                                <h6 class="mb-1">{{ $item->product->name ?? 'Mountain Bike' }}</h6>
                                                <p class="text-muted mb-0">Quantity: {{ $item->quantity ?? 1 }}</p>
                                            </div>
                                            <div class="col-md-4 text-md-end">
                                                <strong>${{ number_format($item->price ?? 500, 2) }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            @else
                                <!-- Sample order items for demonstration -->
                                <div class="order-item">
                                    <div class="row align-items-center">
                                        <div class="col-md-2">
                                            <img src="/products/Mountain_Bike.png" alt="Mountain Bike" class="item-image">
                                        </div>
                                        <div class="col-md-6">
                                            <h6 class="mb-1">Mountain Bike</h6>
                                            <p class="text-muted mb-0">Quantity: 1</p>
                                        </div>
                                        <div class="col-md-4 text-md-end">
                                            <strong>$500.00</strong>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-item">
                                    <div class="row align-items-center">
                                        <div class="col-md-2">
                                            <img src="/products/Accessories.png" alt="Helmet" class="item-image">
                                        </div>
                                        <div class="col-md-6">
                                            <h6 class="mb-1">Cycling Helmet</h6>
                                            <p class="text-muted mb-0">Quantity: 2</p>
                                        </div>
                                        <div class="col-md-4 text-md-end">
                                            <strong>$80.00</strong>
                                        </div>
                                    </div>
                                </div>
                            @endif
                        </div>

                        <!-- Order Summary -->
                        <div class="border-top pt-4">
                            <div class="row">
                                <div class="col-md-6 offset-md-6">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>${{ number_format($order->subtotal ?? 580, 2) }}</span>
                                    </div>
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Tax:</span>
                                        <span>${{ number_format($order->tax_amount ?? 58, 2) }}</span>
                                    </div>
                                    @if($order->shipping_amount ?? false)
                                        <div class="d-flex justify-content-between mb-2">
                                            <span>Shipping:</span>
                                            <span>${{ number_format($order->shipping_amount, 2) }}</span>
                                        </div>
                                    @endif
                                    <div class="d-flex justify-content-between fw-bold fs-5">
                                        <span>Total:</span>
                                        <span>${{ number_format($order->total_amount ?? 638, 2) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-flex justify-content-between align-items-center mt-4 no-print">
                            <a href="/products" class="btn btn-outline-secondary">
                                <i class="bi bi-arrow-left me-2"></i>Continue Shopping
                            </a>
                            <button onclick="window.print()" class="print-button">
                                <i class="bi bi-printer me-2"></i>Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5 no-print">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5><i class="bi bi-bicycle me-2"></i>Bike Yard</h5>
                    <p class="text-muted mb-0">Your trusted partner for all things cycling.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="text-muted mb-0">&copy; 2024 Bike Yard. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 