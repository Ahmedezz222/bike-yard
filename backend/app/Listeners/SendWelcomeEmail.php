<?php

namespace App\Listeners;

use App\Events\UserRegistered;

class SendWelcomeEmail
{
    public function handle(UserRegistered $event)
    {
        // Example: send email to $event->user
        // mail($event->user->email, 'Welcome!', 'Thank you for registering!');
    }
} 