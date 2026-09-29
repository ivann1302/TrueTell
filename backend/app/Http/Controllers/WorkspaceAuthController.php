<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

final class WorkspaceAuthController extends Controller
{
    public function login(): View
    {
        return view('workspace.login');
    }

    public function authenticate(Request $r): RedirectResponse
    {
        $data = $r->validate(['email' => 'required|string|email|max:254', 'password' => 'required|string|max:256']);
        $user = User::where('email', mb_strtolower($data['email']))->first();
        // Constant expensive password check even if the account does not exist.
        $valid = Hash::check($data['password'], $user->password ?? '$2y$12$2bvMeUVqPVBv7sp.3nhVMuJ69QMRdR1/mpOKK4JvaoXkyFV99SxsG');
        if (! $user || ! $valid || ! $user->active) {
            throw ValidationException::withMessages(['email' => 'Не удалось войти. Проверьте email и пароль.']);
        }
        Auth::login($user);
        $r->session()->regenerate();
        $r->session()->forget(['two_factor_verified', 'auth_started_at', 'totp_enrollment']);

        return redirect()->route('workspace.index');
    }

    public function logout(Request $r): RedirectResponse
    {
        Auth::logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return redirect()->route('workspace.login');
    }
}
