<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - Bike Yard</title>
    <style>
        .product-grid { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; margin: 40px 0; }
        .product-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; width: 220px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); text-align: center; }
        .product-card h3 { margin: 12px 0 8px; font-size: 1.1em; }
        .product-card .price { color: #007bff; font-weight: bold; margin-bottom: 8px; display: block; }
        .product-card .category { font-size: 0.95em; color: #666; margin-bottom: 8px; }
    </style>
</head>
<body>
    <h1 style="text-align:center;">Our Products</h1>
    <div class="product-grid">
        @foreach($products as $product)
        <div class="product-card">
            <h3>{{ $product->name }}</h3>
            <span class="category">{{ $product->category }}</span>
            <span class="price">${{ number_format($product->price, 2) }}</span>
            <div>{{ Str::limit($product->description, 60) }}</div>
        </div>
        @endforeach
    </div>
</body>
</html> 