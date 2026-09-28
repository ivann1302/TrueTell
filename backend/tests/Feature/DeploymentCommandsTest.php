<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Support\BackupCipher;
use Illuminate\Database\MySqlConnection;
use Illuminate\Database\Schema\Builder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

final class DeploymentCommandsTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();
        $this->directory = sys_get_temp_dir().'/crm-backup-test-'.bin2hex(random_bytes(8));
        mkdir($this->directory, 0700);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->directory);
        parent::tearDown();
    }

    public function test_backup_encrypts_recoverable_sql_and_preserves_key_on_failure(): void
    {
        $binary = $this->directory.'/mysqldump';
        file_put_contents($binary, <<<'SH'
#!/bin/sh
while IFS= read -r line; do
    [ "$line" != 'socket=""' ] || exit 42
done < "${1#--defaults-extra-file=}"
printf 'CREATE TABLE example (id INT);\n'
SH);
        chmod($binary, 0700);
        config(['database.default' => 'mysql', 'crm.backup.mysqldump_bin' => $binary, 'database.connections.mysql.unix_socket' => '']);
        $target = $this->directory.'/backups';
        self::assertSame(0, Artisan::call('crm:backup', ['directory' => $target]));
        $path = trim(Artisan::output());
        self::assertFileExists($path);
        $key = file_get_contents($target.'/backup.key');
        self::assertSame(0600, fileperms($path) & 0777);
        self::assertSame(0600, fileperms($target.'/backup.key') & 0777);
        self::assertSame(0700, fileperms($target) & 0777);
        $restored = $this->directory.'/restored.sql.gz';
        BackupCipher::decrypt($path, $restored, $target.'/backup.key');
        self::assertSame("CREATE TABLE example (id INT);\n", gzdecode((string) file_get_contents($restored)));
        file_put_contents($binary, "#!/bin/sh\necho secret-password >&2\nexit 1\n");
        self::assertSame(1, Artisan::call('crm:backup', ['directory' => $target]));
        $failureOutput = Artisan::output();
        self::assertStringNotContainsString('secret-password', $failureOutput);
        self::assertStringContainsString('stage: dump', $failureOutput);
        self::assertSame($key, file_get_contents($target.'/backup.key'));
        self::assertCount(2, File::files($target));
    }

    public function test_backup_rejects_sqlite_and_public_directory(): void
    {
        config(['database.default' => 'sqlite']);
        self::assertSame(1, Artisan::call('crm:backup', ['directory' => $this->directory]));
        config(['database.default' => 'mysql']);
        self::assertSame(1, Artisan::call('crm:backup', ['directory' => public_path('backups')]));
        self::assertDirectoryDoesNotExist(public_path('backups'));
    }

    public function test_backup_rejects_deployed_public_html_and_symlink_alias(): void
    {
        $originalBase = base_path();
        $originalPublic = public_path();
        mkdir($this->directory.'/backend');
        mkdir($this->directory.'/public_html');
        symlink($this->directory.'/public_html', $this->directory.'/web-alias');
        $this->app->setBasePath($this->directory.'/backend');
        $this->app->usePublicPath($originalPublic);
        config(['database.default' => 'mysql']);

        try {
            foreach (['public_html', 'web-alias'] as $name) {
                $target = $this->directory.'/'.$name.'/backups';
                self::assertSame(1, Artisan::call('crm:backup', ['directory' => $target]));
                self::assertDirectoryDoesNotExist($target);
            }
            self::assertSame(['.', '..'], scandir($this->directory.'/public_html'));
        } finally {
            $this->app->setBasePath($originalBase);
            $this->app->usePublicPath($originalPublic);
        }
    }

    public function test_preflight_checks_mysql_without_requiring_migrated_tables(): void
    {
        $this->productionConfig();
        $connection = \Mockery::mock(MySqlConnection::class);
        $connection->shouldReceive('getDriverName')->once()->andReturn('mysql');
        DB::shouldReceive('connection')->once()->andReturn($connection);
        DB::shouldReceive('select')->with('SELECT 1')->once()->andReturn([(object) ['1' => 1]]);
        self::assertSame(0, Artisan::call('crm:check-deployment'));
    }

    public function test_after_migrate_requires_application_tables(): void
    {
        $this->productionConfig();
        Schema::swap(\Mockery::mock(Builder::class));
        $connection = \Mockery::mock(MySqlConnection::class);
        $connection->shouldReceive('getDriverName')->twice()->andReturn('mysql');
        DB::shouldReceive('connection')->twice()->andReturn($connection);
        DB::shouldReceive('select')->with('SELECT 1')->twice()->andReturn([(object) ['1' => 1]]);
        Schema::shouldReceive('hasTable')->with('users')->once()->andReturn(false);
        self::assertSame(1, Artisan::call('crm:check-deployment', ['--after-migrate' => true]));
        foreach (['users', 'leads', 'lead_audits', 'telegram_deliveries', 'sessions', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens', 'migrations'] as $table) {
            Schema::shouldReceive('hasTable')->with($table)->once()->andReturn(true);
        }
        self::assertSame(0, Artisan::call('crm:check-deployment', ['--after-migrate' => true]));
    }

    public function test_production_check_rejects_sqlite_and_invalid_key(): void
    {
        $this->productionConfig();
        config(['database.default' => 'sqlite']);
        self::assertSame(1, Artisan::call('crm:check-deployment'));
        config(['app.key' => 'invalid-secret-key']);
        $this->app->forgetInstance('encrypter');
        self::assertSame(1, Artisan::call('crm:check-deployment'));
        self::assertStringNotContainsString('invalid-secret-key', Artisan::output());
    }

    private function productionConfig(): void
    {
        config(['app.env' => 'production', 'app.debug' => false, 'app.url' => 'https://example.test',
            'session.driver' => 'database', 'session.encrypt' => true,
            'session.secure' => true, 'session.http_only' => true]);
    }

    public function test_deployment_check_rejects_non_production_settings(): void
    {
        self::assertSame(1, Artisan::call('crm:check-deployment'));
        self::assertStringNotContainsString((string) config('app.key'), Artisan::output());
    }
}
