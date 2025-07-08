<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Management - Bike Yard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .orders-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 0;
            margin-bottom: 2rem;
        }
        .orders-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .table {
            margin-bottom: 0;
        }
        .table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 1rem;
            font-weight: 600;
        }
        .table td {
            padding: 1rem;
            border-color: #e9ecef;
            vertical-align: middle;
        }
        .table tbody tr {
            transition: all 0.3s ease;
        }
        .table tbody tr:hover {
            background: #f8f9fa;
            transform: scale(1.01);
        }
        .btn-view {
            background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
            border: none;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-view:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3);
        }
        .status-badge {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        .status-pending {
            background: linear-gradient(135deg, #ffc107 0%, #ffca2c 100%);
            color: #212529;
        }
        .status-processing {
            background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
            color: white;
        }
        .status-shipped {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
        }
        .status-delivered {
            background: linear-gradient(135deg, #6f42c1 0%, #8e44ad 100%);
            color: white;
        }
        .status-cancelled {
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
            color: white;
        }
        .stats-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            text-align: center;
            margin-bottom: 2rem;
            transition: all 0.3s ease;
        }
        .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .stats-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #667eea;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="orders-header">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1 class="display-5 fw-bold mb-3">
                        <i class="bi bi-cart me-3"></i>Order Management
                    </h1>
                    <p class="lead mb-0">Track and manage customer orders</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/admin">
                <i class="bi bi-bicycle me-2"></i>Bike Yard Admin
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/admin">Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/products">Products</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/categories">Categories</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/brands">Brands</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="/admin/orders">Orders</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/admin/users">Users</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="container">
        <!-- Statistics -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-cart text-primary mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">{{ count($orders) }}</div>
                    <p class="text-muted mb-0">Total Orders</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-clock text-warning mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">{{ $orders->where('status', 'pending')->count() }}</div>
                    <p class="text-muted mb-0">Pending</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-truck text-info mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">{{ $orders->whereIn('status', ['processing', 'shipped'])->count() }}</div>
                    <p class="text-muted mb-0">In Transit</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-check-circle text-success mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">${{ number_format($orders->sum('total_amount'), 2) }}</div>
                    <p class="text-muted mb-0">Total Revenue</p>
                </div>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="orders-card">
            <div class="card-body p-0">
                <div class="d-flex justify-content-between align-items-center p-4 border-bottom">
                    <h2 class="mb-0">
                        <i class="bi bi-list-ul me-2"></i>Order List
                    </h2>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary">
                            <i class="bi bi-download me-2"></i>Export
                        </button>
                        <button class="btn btn-outline-success">
                            <i class="bi bi-funnel me-2"></i>Filter
                        </button>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($orders as $order)
                            <tr>
                                <td>
                                    <strong>#{{ $order->id }}</strong>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-person me-2 text-primary"></i>
                                        {{ $order->user ? $order->user->name : 'Guest' }}
                                    </div>
                                </td>
                                <td>
                                    @php
                                        $statusClass = 'status-pending';
                                        switch($order->status) {
                                            case 'processing': $statusClass = 'status-processing'; break;
                                            case 'shipped': $statusClass = 'status-shipped'; break;
                                            case 'delivered': $statusClass = 'status-delivered'; break;
                                            case 'cancelled': $statusClass = 'status-cancelled'; break;
                                        }
                                    @endphp
                                    <span class="status-badge {{ $statusClass }}">
                                        {{ ucfirst($order->status) }}
                                    </span>
                                </td>
                                <td>
                                    <strong class="text-success">${{ number_format($order->total_amount, 2) }}</strong>
                                </td>
                                <td>
                                    <i class="bi bi-calendar me-1 text-muted"></i>
                                    {{ $order->created_at->format('M d, Y') }}
                                </td>
                                <td>
                                    <button class="btn btn-view btn-sm">
                                        <i class="bi bi-eye me-1"></i>View
                                    </button>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- Bootstrap JS Bundle CDN -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 