<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Management - Bike Yard</title>
    <style>
        .order-list { max-width: 800px; margin: 40px auto; border-collapse: collapse; width: 100%; }
        .order-list th, .order-list td { border: 1px solid #ddd; padding: 8px; }
        .order-list th { background: #f4f4f4; }
        .actions a { margin-right: 8px; }
    </style>
</head>
<body>
    <h1>Order Management</h1>
    <table class="order-list">
        <thead>
            <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orders as $order)
            <tr>
                <td>{{ $order->id }}</td>
                <td>{{ $order->user ? $order->user->name : 'Guest' }}</td>
                <td>{{ ucfirst($order->status) }}</td>
                <td>${{ number_format($order->total_amount, 2) }}</td>
                <td class="actions">
                    <a href="#">View</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html> 