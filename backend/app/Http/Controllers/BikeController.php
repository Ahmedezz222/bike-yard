<?php

namespace App\Http\Controllers;

use App\Models\Bike;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BikeController extends Controller
{
    public function index(): JsonResponse
    {
        $bikes = Bike::all();
        return response()->json($bikes);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|string|max:255',
            'image_url' => 'nullable|url|max:255',
            'is_available' => 'boolean'
        ]);

        $bike = Bike::create($validated);
        return response()->json($bike, 201);
    }

    public function show(Bike $bike): JsonResponse
    {
        return response()->json($bike);
    }

    public function update(Request $request, Bike $bike): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'brand' => 'string|max:255',
            'model' => 'string|max:255',
            'year' => 'integer|min:1900|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'condition' => 'string|max:255',
            'image_url' => 'nullable|url|max:255',
            'is_available' => 'boolean'
        ]);

        $bike->update($validated);
        return response()->json($bike);
    }

    public function destroy(Bike $bike): JsonResponse
    {
        $bike->delete();
        return response()->json(null, 204);
    }
} 