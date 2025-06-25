<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cart - Bike Yard</title>
    <style>
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
        .total { text-align: right; font-weight: bold; }
        .checkout-btn { background: #007bff; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Cart</h1>
    <table>
        <tr><th>Product</th><th>Quantity</th><th>Price</th></tr>
        <tr><td>Mountain Bike</td><td>1</td><td>$500</td></tr>
        <tr><td>Helmet</td><td>2</td><td>$40</td></tr>
    </table>
    <div class="total">Total: $580</div>
    <button class="checkout-btn">Proceed to Checkout</button>
</body>
</html> 