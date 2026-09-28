<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

final class CreateWorkspaceAdmin extends Command
{
    protected $signature = 'crm:admin {email} {name}';

    protected $description = 'Create an administrator; password is prompted securely';

    public function handle(): int
    {
        $data = ['email' => mb_strtolower((string) $this->argument('email')), 'name' => $this->argument('name'), 'password' => $this->secret('Password (14+ characters, letters and numbers)')];
        $validator = Validator::make($data, ['email' => 'required|email|max:254|unique:users,email', 'name' => 'required|string|max:120', 'password' => ['required', 'string', 'max:256', Password::min(14)->letters()->numbers()]]);
        if ($validator->fails()) {
            $this->error($validator->errors()->first());

            return self::FAILURE;
        }
        $u = new User;
        $u->forceFill([...$data, 'role' => 'admin'])->save();
        $this->info('Administrator created. Enroll an authenticator on first sign-in.');

        return self::SUCCESS;
    }
}
