<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        'App\Events\UserRegistered' => [
            'App\Listeners\SendWelcomeEmail',
        ],
        'App\Events\OrderPlaced' => [
            'App\Listeners\NotifyAdminOfOrder',
        ],
    ];

    public function boot(): void
    {
        parent::boot();
    }
} 