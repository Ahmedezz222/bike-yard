<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Product - Bike Yard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .add-product-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 0;
            margin-bottom: 2rem;
        }
        .form-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            max-width: 800px;
            margin: 0 auto;
        }
        .form-control, .form-select {
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 12px 15px;
            transition: all 0.3s ease;
            font-size: 1rem;
        }
        .form-control:focus, .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .btn-submit {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border: none;
            border-radius: 10px;
            padding: 0.75rem 1.5rem;
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 1.1rem;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        }
        .form-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 0.5rem;
        }
        .input-group-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px 0 0 10px;
        }
        .file-input-wrapper {
            position: relative;
            overflow: hidden;
            display: inline-block;
            width: 100%;
        }
        .file-input-wrapper input[type=file] {
            position: absolute;
            left: -9999px;
        }
        .file-input-label {
            display: block;
            padding: 12px 15px;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .file-input-label:hover {
            border-color: #667eea;
            background: #e3f2fd;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="add-product-header">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1 class="display-5 fw-bold mb-3">
                        <i class="bi bi-plus-circle me-3"></i>Add New Product
                    </h1>
                    <p class="lead mb-0">Create a new product for your inventory</p>
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
                        <a class="nav-link" href="/admin/users">Users</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="container">
        <div class="form-card">
            <div class="card-body p-4">
                <form method="POST" action="/add-product" enctype="multipart/form-data">
                    @csrf
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="name" class="form-label">
                                    <i class="bi bi-box me-2"></i>Product Name
                                </label>
                                <input type="text" name="name" id="name" class="form-control" placeholder="Enter product name" required />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="category" class="form-label">
                                    <i class="bi bi-grid me-2"></i>Category
                                </label>
                                <select name="category" id="category" class="form-select" required>
                                    <option value="">Select Category</option>
                                    <option value="Mountain Bike">Mountain Bike</option>
                                    <option value="Road Bike">Road Bike</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="price" class="form-label">
                                    <i class="bi bi-currency-dollar me-2"></i>Price
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="number" name="price" id="price" class="form-control" placeholder="0.00" step="0.01" required />
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="stock" class="form-label">
                                    <i class="bi bi-boxes me-2"></i>Stock Quantity
                                </label>
                                <input type="number" name="stock" id="stock" class="form-control" placeholder="Enter stock quantity" min="0" required />
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label">
                            <i class="bi bi-text-paragraph me-2"></i>Description
                        </label>
                        <textarea name="description" id="description" class="form-control" placeholder="Enter product description" rows="4" required></textarea>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="brand" class="form-label">
                                    <i class="bi bi-tags me-2"></i>Brand
                                </label>
                                <input type="text" name="brand" id="brand" class="form-control" placeholder="Enter brand name" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="model" class="form-label">
                                    <i class="bi bi-gear me-2"></i>Model
                                </label>
                                <input type="text" name="model" id="model" class="form-control" placeholder="Enter model name" />
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="year" class="form-label">
                                    <i class="bi bi-calendar me-2"></i>Year
                                </label>
                                <input type="number" name="year" id="year" class="form-control" placeholder="Year" min="1900" max="2100" />
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="condition" class="form-label">
                                    <i class="bi bi-star me-2"></i>Condition
                                </label>
                                <select name="condition" id="condition" class="form-select">
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                    <option value="refurbished">Refurbished</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="warranty" class="form-label">
                                    <i class="bi bi-shield-check me-2"></i>Warranty
                                </label>
                                <input type="text" name="warranty" id="warranty" class="form-control" placeholder="e.g., 1 year" />
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="image" class="form-label">
                            <i class="bi bi-image me-2"></i>Product Image
                        </label>
                        <div class="file-input-wrapper">
                            <label for="image" class="file-input-label">
                                <i class="bi bi-cloud-upload me-2"></i>
                                Choose a file or drag it here
                            </label>
                            <input type="file" name="image" id="image" accept="image/*" required />
                        </div>
                    </div>

                    <div class="text-center">
                        <button type="submit" class="btn btn-submit btn-lg">
                            <i class="bi bi-plus-circle me-2"></i>Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <!-- Bootstrap JS Bundle CDN -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 