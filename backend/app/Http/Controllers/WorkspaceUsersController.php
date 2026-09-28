<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

final class WorkspaceUsersController extends Controller
{
    public function index(): View
    {
        return view('workspace.users', ['users' => User::orderBy('name')->get()]);
    }

    public function store(Request $r): RedirectResponse
    {
        if (is_string($r->input('email'))) {
            $r->merge(['email' => mb_strtolower($r->input('email'))]);
        }
        $data = $r->validate(['name' => 'required|string|max:120', 'email' => 'required|email:rfc|max:254|unique:users,email', 'password' => ['required', 'string', 'confirmed', 'max:256', Password::min(14)->letters()->numbers()]]);
        User::create(['name' => $data['name'], 'email' => $data['email'], 'password' => $data['password']]);

        return redirect()->route('workspace.users')->with('status', 'Сотрудник добавлен. Передайте пароль лично; при первом входе он настроит второй фактор.');
    }

    public function toggle(Request $r, User $user): RedirectResponse
    {
        abort_if($user->id === $r->user()?->id || $user->role === 'admin', 403);
        DB::transaction(function () use ($user): void {
            $locked = User::lockForUpdate()->findOrFail($user->id);
            $locked->forceFill(['active' => ! $locked->active])->save();
            DB::table('sessions')->where('user_id', $locked->id)->delete();
        });

        return redirect()->route('workspace.users')->with('status', 'Доступ обновлён, текущие сессии сотрудника завершены.');
    }
}
