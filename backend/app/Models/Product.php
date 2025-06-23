<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'images',
        'category',
        'stock',
        'featured',
        'sku',
        'weight',
        'dimensions',
        'brand',
        'model',
        'year',
        'condition',
        'warranty',
        'shipping_info',
    ];

    protected $casts = [
        'images' => 'array',
        'featured' => 'boolean',
        'price' => 'decimal:2',
        'stock' => 'integer',
        'weight' => 'decimal:2',
        'dimensions' => 'array',
    ];

    /**
     * Get the category that owns the product
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get order items for this product
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope for featured products
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope for in stock products
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Scope for products by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for price range
     */
    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    /**
     * Check if product is in stock
     */
    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Get main image
     */
    public function getMainImageAttribute()
    {
        return $this->images[0] ?? null;
    }
} 