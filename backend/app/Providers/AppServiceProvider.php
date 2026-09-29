<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceRootUrl(config()->string('app.url'));
            URL::forceScheme('https');
        }
        RateLimiter::for('leads', fn (Request $r) => [Limit::perMinute(5)->by($r->ip()), Limit::perDay(100)->by($r->ip())]);
        RateLimiter::for('login', fn (Request $r) => [Limit::perMinute(10)->by($r->ip()), Limit::perMinute(5)->by(hash('sha256', strtolower(is_string($r->input('email')) ? $r->input('email') : '')))]);
    }
}
