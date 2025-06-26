<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - Bike Yard</title>
    <style>
        .product-table { max-width: 900px; margin: 40px auto; border-collapse: collapse; width: 100%; }
        .product-table th, .product-table td { border: 1px solid #ddd; padding: 8px; }
        .product-table th { background: #f4f4f4; }
        .actions a { margin-right: 8px; }
    </style>
</head>
<body>
    <h1>Products</h1>
    <table class="product-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
            <tr>
                <td>{{ $product->id }}</td>
                <td>{{ $product->name }}</td>
                <td>{{ $product->category }}</td>
                <td>${{ number_format($product->price, 2) }}</td>
                <td>{{ $product->stock }}</td>
                <td class="actions">
                    <a href="#">Edit</a>
                    <a href="#">Delete</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html> 