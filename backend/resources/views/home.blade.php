<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Bike Yard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .dashboard-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 0;
            margin-bottom: 2rem;
        }
        .dashboard-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            padding: 2rem;
        }
        .nav-link {
            display: block;
            margin-bottom: 1rem;
            color: #667eea;
            text-decoration: none;
            font-size: 1.1rem;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            background: #f8f9fa;
        }
        .nav-link:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        .nav-link i {
            margin-right: 0.75rem;
            font-size: 1.2rem;
        }
        .stats-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            text-align: center;
            margin-bottom: 1.5rem;
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
    <header class="dashboard-header">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1 class="display-5 fw-bold mb-3">
                        <i class="bi bi-speedometer2 me-3"></i>Admin Dashboard
                    </h1>
                    <p class="lead mb-0">Welcome to Bike Yard Administration</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container">
        <!-- Statistics -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-box text-primary mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">24</div>
                    <p class="text-muted mb-0">Total Products</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-grid text-success mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">8</div>
                    <p class="text-muted mb-0">Categories</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-cart text-warning mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">156</div>
                    <p class="text-muted mb-0">Orders</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-people text-info mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">89</div>
                    <p class="text-muted mb-0">Users</p>
                </div>
            </div>
        </div>

        <!-- Navigation Cards -->
        <div class="dashboard-card">
            <h2 class="mb-4 text-center">
                <i class="bi bi-gear me-2"></i>Quick Actions
            </h2>
            <div class="row">
                <div class="col-md-6">
                    <a href="/admin/products" class="nav-link">
                        <i class="bi bi-box"></i>Products Management
                    </a>
                    <a href="/admin/categories" class="nav-link">
                        <i class="bi bi-grid"></i>Categories
                    </a>
                    <a href="/admin/brands" class="nav-link">
                        <i class="bi bi-tags"></i>Brands
                    </a>
                    <a href="/admin/add-product" class="nav-link">
                        <i class="bi bi-plus-circle"></i>Add Product
                    </a>
                </div>
                <div class="col-md-6">
                    <a href="/admin/orders" class="nav-link">
                        <i class="bi bi-cart"></i>Orders
                    </a>
                    <a href="/admin/users" class="nav-link">
                        <i class="bi bi-people"></i>Users
                    </a>
                    <a href="/signin" class="nav-link">
                        <i class="bi bi-box-arrow-in-right"></i>Sign In
                    </a>
                    <a href="/signup" class="nav-link">
                        <i class="bi bi-person-plus"></i>Sign Up
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Bootstrap JS Bundle CDN -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 