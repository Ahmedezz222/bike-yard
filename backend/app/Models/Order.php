<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'total_amount',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'status',
        'payment_status',
        'payment_method',
        'shipping_address',
        'billing_address',
        'tracking_number',
        'carrier',
        'estimated_delivery',
        'notes',
        'status_history',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'status_history' => 'array',
        'estimated_delivery' => 'datetime',
    ];

    /**
     * Get the user that owns the order
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get order items
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope for orders by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for orders by payment status
     */
    public function scopeByPaymentStatus($query, $paymentStatus)
    {
        return $query->where('payment_status', $paymentStatus);
    }

    /**
     * Scope for recent orders
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Get order status options
     */
    public static function getStatusOptions(): array
    {
        return [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
        ];
    }

    /**
     * Get payment status options
     */
    public static function getPaymentStatusOptions(): array
    {
        return [
            'pending' => 'Pending',
            'paid' => 'Paid',
            'failed' => 'Failed',
            'refunded' => 'Refunded',
        ];
    }

    /**
     * Update order status and add to history
     */
    public function updateStatus($newStatus, $notes = null)
    {
        $this->status = $newStatus;
        
        $history = $this->status_history ?? [];
        $history[] = [
            'status' => $newStatus,
            'date' => now()->toISOString(),
            'notes' => $notes,
        ];
        
        $this->status_history = $history;
        $this->save();
    }

    /**
     * Calculate total items count
     */
    public function getTotalItemsAttribute()
    {
        return $this->items->sum('quantity');
    }
} 