<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Support\BackupCipher;
use Illuminate\Console\Command;
use RuntimeException;
use Throwable;

final class DecryptCrmBackup extends Command
{
    protected $signature = 'crm:decrypt-backup {archive} {destination} {key}';

    protected $description = 'Decrypt a CRM backup to a private .sql.gz file without restoring the database';

    public function handle(): int
    {
        try {
            $destination = $this->argument('destination');
            $parent = realpath(dirname($destination));
            if ($parent === false || ! str_ends_with($destination, '.sql.gz')) {
                throw new RuntimeException;
            }
            foreach ([public_path(), dirname(base_path()).'/public_html'] as $path) {
                $public = realpath($path);
                if ($public !== false && ($parent === $public || str_starts_with($parent, $public.'/'))) {
                    throw new RuntimeException;
                }
            }
            BackupCipher::decrypt($this->argument('archive'), $parent.'/'.basename($destination), $this->argument('key'));
            $this->info('Backup decrypted to the private destination. No database changes were made.');

            return self::SUCCESS;
        } catch (Throwable) {
            $this->error('Decryption failed. Check the archive, key, and a new private .sql.gz destination.');

            return self::FAILURE;
        }
    }
}
