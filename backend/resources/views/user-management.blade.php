<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - Bike Yard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .users-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 0;
            margin-bottom: 2rem;
        }
        .users-card {
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
        .btn-edit {
            background: linear-gradient(135deg, #ffc107 0%, #ffca2c 100%);
            border: none;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            color: #212529;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-edit:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
        }
        .role-badge {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
        }
        .role-admin {
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
            color: white;
        }
        .role-user {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
        }
        .role-guest {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
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
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.1rem;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="users-header">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1 class="display-5 fw-bold mb-3">
                        <i class="bi bi-people me-3"></i>User Management
                    </h1>
                    <p class="lead mb-0">Manage your user accounts and permissions</p>
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
                        <a class="nav-link" href="/admin/orders">Orders</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="/admin/users">Users</a>
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
                    <i class="bi bi-people text-primary mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">{{ count($users) }}</div>
                    <p class="text-muted mb-0">Total Users</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-person-check text-success mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">{{ $users->where('role', 'user')->count() }}</div>
                    <p class="text-muted mb-0">Regular Users</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-shield-check text-warning mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">{{ $users->where('role', 'admin')->count() }}</div>
                    <p class="text-muted mb-0">Administrators</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <i class="bi bi-calendar-check text-info mb-2" style="font-size: 2rem;"></i>
                    <div class="stats-number">{{ $users->where('created_at', '>=', now()->subDays(30))->count() }}</div>
                    <p class="text-muted mb-0">New This Month</p>
                </div>
            </div>
        </div>

        <!-- Users Table -->
        <div class="users-card">
            <div class="card-body p-0">
                <div class="d-flex justify-content-between align-items-center p-4 border-bottom">
                    <h2 class="mb-0">
                        <i class="bi bi-list-ul me-2"></i>User List
                    </h2>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary">
                            <i class="bi bi-person-plus me-2"></i>Add User
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
                                <th>User ID</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($users as $user)
                            <tr>
                                <td>
                                    <strong>#{{ $user->id }}</strong>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="user-avatar me-3">
                                            {{ strtoupper(substr($user->name, 0, 1)) }}
                                        </div>
                                        <div>
                                            <div class="fw-bold">{{ $user->name }}</div>
                                            <small class="text-muted">ID: {{ $user->id }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-envelope me-2 text-muted"></i>
                                        {{ $user->email }}
                                    </div>
                                </td>
                                <td>
                                    @php
                                        $roleClass = 'role-user';
                                        switch($user->role) {
                                            case 'admin': $roleClass = 'role-admin'; break;
                                            case 'guest': $roleClass = 'role-guest'; break;
                                        }
                                    @endphp
                                    <span class="role-badge {{ $roleClass }}">
                                        {{ ucfirst($user->role) }}
                                    </span>
                                </td>
                                <td>
                                    <i class="bi bi-calendar me-1 text-muted"></i>
                                    {{ $user->created_at->format('M d, Y') }}
                                </td>
                                <td>
                                    <button class="btn btn-view btn-sm me-2">
                                        <i class="bi bi-eye me-1"></i>View
                                    </button>
                                    <button class="btn btn-edit btn-sm">
                                        <i class="bi bi-pencil me-1"></i>Edit
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