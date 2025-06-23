<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@bikeyard.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '+1234567890',
            'address' => '123 Admin Street',
            'city' => 'Admin City',
            'state' => 'AS',
            'zip_code' => '12345',
            'country' => 'US',
        ]);

        // Create regular user
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'phone' => '+1234567891',
            'address' => '456 User Avenue',
            'city' => 'User City',
            'state' => 'US',
            'zip_code' => '54321',
            'country' => 'US',
        ]);

        // Create more sample users
        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'phone' => '+1234567892',
            'address' => '789 Customer Road',
            'city' => 'Customer Town',
            'state' => 'CT',
            'zip_code' => '67890',
            'country' => 'US',
        ]);

        // Create additional users using factory
        User::factory(10)->create();
    }
}
