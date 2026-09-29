<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

final class ResetWorkspaceAccess extends Command
{
    protected $signature = 'crm:reset-access {email}';

    protected $description = 'Reset password after independently verifying identity; revokes sessions';

    public function handle(): int
    {
        $user = User::where('email', mb_strtolower((string) $this->argument('email')))->first();
        if (! $user) {
            $this->error('Account not found.');

            return self::FAILURE;
        }
        if (! $this->confirm('Identity verified? Reset password and all sessions?', false)) {
            return self::FAILURE;
        }
        $password = $this->secret('New password (14+ characters, letters and numbers)');
        $v = Validator::make(['password' => $password], ['password' => ['required', 'string', 'max:256', Password::min(14)->letters()->numbers()]]);
        if ($v->fails()) {
            $this->error($v->errors()->first());

            return self::FAILURE;
        }
        DB::transaction(function () use ($user, $password): void {
            $user->forceFill(['password' => $password, 'totp_secret' => null, 'totp_confirmed_at' => null, 'totp_last_step' => null])->save();
            DB::table('sessions')->where('user_id', $user->id)->delete();
        });
        $this->info('Access reset. Sign in with the new password.');

        return self::SUCCESS;
    }
}
