<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Support\BackupCipher;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

final class BackupCrm extends Command
{
    protected $signature = 'crm:backup {directory}';

    protected $description = 'Create a private encrypted MySQL backup';

    public function handle(): int
    {
        $temporary = [];
        $output = null;
        $stage = 'configuration';
        $oldMask = umask(0077);
        try {
            $connection = DB::connection();
            if ($connection->getDriverName() !== 'mysql') {
                throw new RuntimeException;
            }
            $directory = $this->argument('directory');
            if ($directory === '' || str_contains($directory, "\n")) {
                throw new RuntimeException;
            }
            // Resolve the existing parent before creating anything under the requested path.
            $resolved = realpath($directory);
            if ($resolved === false) {
                $parent = realpath(dirname($directory));
                if ($parent === false || in_array(basename($directory), ['.', '..'], true)) {
                    throw new RuntimeException;
                }
                $resolved = $parent.'/'.basename($directory);
            }
            $public = realpath(public_path());
            if ($public === false || $resolved === $public || str_starts_with($resolved, $public.'/')) {
                throw new RuntimeException;
            }
            // Release deployments serve a sibling public_html, not Laravel's public directory.
            $deployedPublic = realpath(dirname(base_path()).'/public_html');
            if ($deployedPublic !== false && ($resolved === $deployedPublic || str_starts_with($resolved, $deployedPublic.'/'))) {
                throw new RuntimeException;
            }
            if ((! is_dir($resolved) && ! mkdir($resolved, 0700)) || ! chmod($resolved, 0700)) {
                throw new RuntimeException;
            }
            $stage = 'key';
            $key = $resolved.'/backup.key';
            if (is_link($key)) {
                throw new RuntimeException;
            }
            if (! file_exists($key)) {
                $handle = fopen($key, 'x');
                if ($handle === false) {
                    throw new RuntimeException;
                }
                try {
                    if (fwrite($handle, bin2hex(random_bytes(48))."\n") !== 97) {
                        throw new RuntimeException;
                    }
                } finally {
                    fclose($handle);
                }
            }
            if (! chmod($key, 0600) || filesize($key) < 64) {
                throw new RuntimeException;
            }
            $stage = 'temporary files';
            foreach (['credentials', 'sql', 'compressed'] as $name) {
                $path = tempnam($resolved, '.'.$name.'-');
                if ($path === false) {
                    throw new RuntimeException;
                }
                $temporary[$name] = $path;
            }
            $credentials = "[client]\n";
            foreach (['host' => 'host', 'port' => 'port', 'username' => 'user', 'password' => 'password', 'unix_socket' => 'socket'] as $config => $option) {
                $value = $connection->getConfig($config);
                if ($config === 'unix_socket' && $value === '') {
                    continue;
                }
                if (is_string($value) || is_int($value)) {
                    $credentials .= $option.'="'.strtr((string) $value, ['\\' => '\\\\', '"' => '\\"', "\n" => '\\n', "\r" => '\\r'])."\"\n";
                }
            }
            if (file_put_contents($temporary['credentials'], $credentials) === false) {
                throw new RuntimeException;
            }
            $database = $connection->getDatabaseName();
            $stage = 'dump';
            $this->runTool([$this->binary('mysqldump'), '--defaults-extra-file='.$temporary['credentials'], '--single-transaction', '--quick', '--no-tablespaces', '--skip-lock-tables', '--', $database], $temporary['sql']);
            $stage = 'compression';
            $this->runTool([$this->binary('gzip'), '-c', $temporary['sql']], $temporary['compressed']);
            $output = $resolved.'/'.gmdate('Ymd-His').'-'.bin2hex(random_bytes(8)).'.sql.gz.enc';
            $stage = 'encryption';
            BackupCipher::encrypt($temporary['compressed'], $output, $key);
            $this->line($output);

            return self::SUCCESS;
        } catch (Throwable) {
            $this->error('Backup failed (stage: '.$stage.'). Check the private directory, MySQL settings, and required executables.');

            return self::FAILURE;
        } finally {
            foreach ($temporary as $path) {
                if (is_file($path)) {
                    unlink($path);
                }
            }
            umask($oldMask);
        }
    }

    private function binary(string $name): string
    {
        $value = config('crm.backup.'.$name.'_bin', $name);
        if (! is_string($value) || $value === '') {
            throw new RuntimeException;
        }

        return $value;
    }

    /** @param list<string> $arguments */
    private function runTool(array $arguments, string $output): void
    {
        // File descriptors stream large dumps without holding SQL in PHP memory.
        $process = proc_open($arguments, [0 => ['file', '/dev/null', 'r'], 1 => ['file', $output, 'w'], 2 => ['file', '/dev/null', 'w']], $pipes);
        if (! is_resource($process) || proc_close($process) !== 0) {
            throw new RuntimeException;
        }
    }
}
