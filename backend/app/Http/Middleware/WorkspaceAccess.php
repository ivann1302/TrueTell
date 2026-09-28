<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class WorkspaceAccess
{
    public function handle(Request $request, Closure $next, string $level = 'verified'): Response
    {
        $user = $request->user();
        if (! $user || ! $user->active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return $request->expectsJson() ? response()->json(['message' => 'Unauthorized'], 401) : redirect()->route('workspace.login');
        }
        if ($level !== 'pending' && (! $user->totp_confirmed_at || ! $request->session()->get('two_factor_verified'))) {
            return redirect()->route('workspace.two-factor');
        }
        if ($level === 'admin' && $user->role !== 'admin') {
            abort(403);
        }

        return $next($request);
    }
}
