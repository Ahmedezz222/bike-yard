<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Product - Bike Yard</title>
    <style>
        .add-product-form { max-width: 500px; margin: 40px auto; }
        .add-product-form input, .add-product-form select, .add-product-form textarea { width: 100%; margin-bottom: 12px; padding: 8px; }
        .add-product-form button { background: #007bff; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Add New Product</h1>
    <form class="add-product-form" method="POST" action="/add-product" enctype="multipart/form-data">
        @csrf
        <input type="text" name="name" placeholder="Product Name" required />
        <select name="category" required>
            <option value="">Select Category</option>
            <option value="Mountain Bike">Mountain Bike</option>
            <option value="Road Bike">Road Bike</option>
            <option value="Accessories">Accessories</option>
        </select>
        <input type="number" name="price" placeholder="Price" step="0.01" required />
        <textarea name="description" placeholder="Description" rows="4" required></textarea>
        <input type="text" name="brand" placeholder="Brand" />
        <input type="text" name="model" placeholder="Model" />
        <input type="number" name="year" placeholder="Year" min="1900" max="2100" />
        <input type="number" name="stock" placeholder="Stock" min="0" required />
        <select name="condition">
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
        </select>
        <input type="text" name="warranty" placeholder="Warranty" />
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">Add Product</button>
    </form>
</body>
</html> 