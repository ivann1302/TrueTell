<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;

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
        $valid = Hash::check($data['password'], $user->password ?? '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi');
        if (! $user || ! $valid || ! $user->active) {
            throw ValidationException::withMessages(['email' => 'Не удалось войти. Проверьте email и пароль.']);
        }
        Auth::login($user);
        $r->session()->regenerate();
        $r->session()->forget('two_factor_verified');
        $r->session()->put('auth_started_at', time());

        return redirect()->route('workspace.two-factor');
    }

    public function challenge(Request $r, Google2FA $totp): View|RedirectResponse
    {
        if (! $this->pendingIsValid($r)) {
            return $this->logout($r);
        }
        $user = $r->user();
        assert($user instanceof User);
        $enrolling = $user->totp_confirmed_at === null;
        if ($enrolling && ! $r->session()->has('totp_enrollment')) {
            $r->session()->put('totp_enrollment', $totp->generateSecretKey());
        }

        return view('workspace.two-factor', ['enrolling' => $enrolling, 'secret' => $enrolling ? $r->session()->get('totp_enrollment') : null]);
    }

    public function verify(Request $r, Google2FA $totp): RedirectResponse
    {
        if (! $this->pendingIsValid($r)) {
            return $this->logout($r);
        }
        $data = $r->validate(['code' => ['required', 'string', 'regex:/^[0-9]{6}$/']]);
        DB::transaction(function () use ($r, $totp, $data): void {
            $user = User::lockForUpdate()->findOrFail($r->user()?->id);
            abort_unless($user->active, 403);
            $secret = $user->totp_confirmed_at ? $user->totp_secret : $r->session()->get('totp_enrollment');
            $step = is_string($secret) ? $totp->verifyKeyNewer($secret, $data['code'], $user->totp_last_step ?? 0, 1) : false;
            if ($step === false) {
                throw ValidationException::withMessages(['code' => 'Неверный или уже использованный код. Дождитесь нового кода.']);
            }
            $user->forceFill(['totp_secret' => $secret, 'totp_confirmed_at' => $user->totp_confirmed_at ?? now(), 'totp_last_step' => $step])->save();
        });
        $r->session()->regenerate();
        $r->session()->put('two_factor_verified', true);
        $r->session()->forget(['auth_started_at', 'totp_enrollment']);

        return redirect()->route('workspace.index');
    }

    private function pendingIsValid(Request $r): bool
    {
        return is_int($r->session()->get('auth_started_at')) && time() - $r->session()->get('auth_started_at') < 600;
    }

    public function logout(Request $r): RedirectResponse
    {
        Auth::logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return redirect()->route('workspace.login');
    }
}
