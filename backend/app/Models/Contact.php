<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'priority',
        'assigned_to',
        'response',
        'response_date',
        'source',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'response_date' => 'datetime',
    ];

    /**
     * Get the user assigned to this contact
     */
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Scope for unread messages
     */
    public function scopeUnread($query)
    {
        return $query->where('status', 'unread');
    }

    /**
     * Scope for read messages
     */
    public function scopeRead($query)
    {
        return $query->where('status', 'read');
    }

    /**
     * Scope for responded messages
     */
    public function scopeResponded($query)
    {
        return $query->where('status', 'responded');
    }

    /**
     * Scope for high priority messages
     */
    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    /**
     * Get status options
     */
    public static function getStatusOptions(): array
    {
        return [
            'unread' => 'Unread',
            'read' => 'Read',
            'responded' => 'Responded',
            'closed' => 'Closed',
        ];
    }

    /**
     * Get priority options
     */
    public static function getPriorityOptions(): array
    {
        return [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
            'urgent' => 'Urgent',
        ];
    }

    /**
     * Mark as read
     */
    public function markAsRead()
    {
        $this->update(['status' => 'read']);
    }

    /**
     * Mark as responded
     */
    public function markAsResponded($response = null)
    {
        $this->update([
            'status' => 'responded',
            'response' => $response,
            'response_date' => now(),
        ]);
    }
} 