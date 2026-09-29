<?php

declare(strict_types=1);
use App\Http\Controllers\LeadIntakeController;
use App\Http\Controllers\WorkspaceAuthController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceUsersController;
use App\Http\Middleware\PrivateHeaders;
use Illuminate\Support\Facades\Route;

Route::middleware(PrivateHeaders::class)->group(function (): void {
    Route::get('/api/lead-session', [LeadIntakeController::class, 'session'])->middleware('throttle:60,1');
    Route::post('/api/leads', [LeadIntakeController::class, 'store'])->middleware('throttle:leads');
    Route::prefix('workspace')->name('workspace.')->group(function (): void {
        Route::get('/login', [WorkspaceAuthController::class, 'login'])->name('login');
        Route::post('/login', [WorkspaceAuthController::class, 'authenticate'])->middleware('throttle:login')->name('login.store');
        Route::post('/logout', [WorkspaceAuthController::class, 'logout'])->name('logout');
        Route::middleware('workspace')->group(function (): void {
            Route::get('/', [WorkspaceController::class, 'index'])->name('index');
            Route::post('/leads/{lead}/status', [WorkspaceController::class, 'status'])->name('leads.status');
        });
        Route::middleware('workspace:admin')->group(function (): void {
            Route::get('/users', [WorkspaceUsersController::class, 'index'])->name('users');
            Route::post('/users', [WorkspaceUsersController::class, 'store'])->name('users.store');
            Route::post('/users/{user}/toggle', [WorkspaceUsersController::class, 'toggle'])->name('users.toggle');
        });
    });
});
