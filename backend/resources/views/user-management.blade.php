<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - Bike Yard</title>
    <style>
        .user-list { max-width: 800px; margin: 40px auto; border-collapse: collapse; width: 100%; }
        .user-list th, .user-list td { border: 1px solid #ddd; padding: 8px; }
        .user-list th { background: #f4f4f4; }
        .actions a { margin-right: 8px; }
    </style>
</head>
<body>
    <h1>User Management</h1>
    <table class="user-list">
        <thead>
            <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td>{{ $user->id }}</td>
                <td>{{ $user->name }}</td>
                <td>{{ $user->email }}</td>
                <td>{{ ucfirst($user->role) }}</td>
                <td class="actions">
                    <a href="#">View</a>
                    <a href="#">Edit</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html> 