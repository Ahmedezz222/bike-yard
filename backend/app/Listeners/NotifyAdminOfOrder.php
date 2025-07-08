<?php

namespace App\Listeners;

use App\Events\OrderPlaced;

class NotifyAdminOfOrder
{
    public function handle(OrderPlaced $event)
    {
        // Example: notify admin about $event->order
        // Notification logic here
    }
} 