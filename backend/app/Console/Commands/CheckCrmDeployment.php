<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Throwable;

final class CheckCrmDeployment extends Command
{
    protected $signature = 'crm:check-deployment {--after-migrate}';

    protected $description = 'Check production configuration and database readiness without changing data';

    public function handle(): int
    {
        try {
            $url = config('app.url');
            if (config('app.env') !== 'production' || config('app.debug') !== false
                || ! is_string($url) || filter_var($url, FILTER_VALIDATE_URL) === false
                || parse_url($url, PHP_URL_SCHEME) !== 'https'
                || config('session.driver') !== 'database' || config('session.encrypt') !== true
                || config('session.secure') !== true || config('session.http_only') !== true) {
                throw new RuntimeException;
            }
            $encrypter = app(Encrypter::class);
            // Resolving and exercising the encrypter validates the configured key and cipher.
            if ($encrypter->decrypt($encrypter->encrypt('deployment-check')) !== 'deployment-check') {
                throw new RuntimeException;
            }
            if (DB::connection()->getDriverName() !== 'mysql') {
                throw new RuntimeException;
            }
            DB::select('SELECT 1');
            if ($this->option('after-migrate')) {
                foreach (['users', 'leads', 'lead_audits', 'telegram_deliveries', 'sessions', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens', 'migrations'] as $table) {
                    if (! Schema::hasTable($table)) {
                        throw new RuntimeException;
                    }
                }
            }
            $this->info('Deployment checks passed.');

            return self::SUCCESS;
        } catch (Throwable) {
            $this->error('Deployment check failed. Verify production configuration, application key, MySQL connectivity, and migrations.');

            return self::FAILURE;
        }
    }
}
