<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Support\BackupCipher;
use Illuminate\Support\Facades\File;
use RuntimeException;
use Tests\TestCase;

final class BackupCipherTest extends TestCase
{
    private string $directory;

    protected function setUp(): void
    {
        parent::setUp();
        $this->directory = sys_get_temp_dir().'/crm-cipher-'.bin2hex(random_bytes(8));
        mkdir($this->directory, 0700);
        file_put_contents($this->path('key'), bin2hex(random_bytes(48))."\n");
        file_put_contents($this->path('source'), random_bytes(150000));
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->directory);
        parent::tearDown();
    }

    public function test_round_trip_streams_multiple_chunks_and_empty_input(): void
    {
        foreach ([150000, 0] as $length) {
            file_put_contents($this->path('source'), $length === 0 ? '' : random_bytes($length));
            BackupCipher::encrypt($this->path('source'), $this->path('archive'.$length), $this->path('key'));
            BackupCipher::decrypt($this->path('archive'.$length), $this->path('restored'.$length), $this->path('key'));
            self::assertFileEquals($this->path('source'), $this->path('restored'.$length));
            self::assertSame(0600, fileperms($this->path('restored'.$length)) & 0777);
        }
    }

    public function test_corrupt_truncated_trailing_and_wrong_key_archives_leave_no_plaintext(): void
    {
        BackupCipher::encrypt($this->path('source'), $this->path('archive'), $this->path('key'));
        $archive = file_get_contents($this->path('archive'));
        self::assertIsString($archive);
        $tampered = $archive;
        $tampered[50] = chr(ord($tampered[50]) ^ 1);
        $cases = [$tampered, substr($archive, 0, -21), $archive.'trailing', substr($archive, 0, -1), substr_replace($archive, pack('N', 0xFFFFFFFF), 32, 4)];
        foreach ($cases as $case) {
            file_put_contents($this->path('bad'), $case);
            $this->assertRejected('bad');
        }
        file_put_contents($this->path('key'), bin2hex(random_bytes(48))."\n");
        $this->assertRejected('archive');
    }

    public function test_existing_destination_is_preserved_for_both_operations(): void
    {
        BackupCipher::encrypt($this->path('source'), $this->path('archive'), $this->path('key'));
        file_put_contents($this->path('restored'), 'existing');
        foreach (['encrypt', 'decrypt'] as $operation) {
            try {
                BackupCipher::$operation($this->path('archive'), $this->path('restored'), $this->path('key'));
                self::fail('Existing destination must be rejected.');
            } catch (RuntimeException) {
                self::assertSame('existing', file_get_contents($this->path('restored')));
            }
        }
    }

    public function test_decrypt_command_refuses_public_output_and_restores_private_gzip(): void
    {
        BackupCipher::encrypt($this->path('source'), $this->path('archive'), $this->path('key'));
        $this->artisan('crm:decrypt-backup', ['archive' => $this->path('archive'), 'destination' => public_path('restore.sql.gz'), 'key' => $this->path('key')])->assertFailed();
        self::assertFileDoesNotExist(public_path('restore.sql.gz'));
        $this->artisan('crm:decrypt-backup', ['archive' => $this->path('archive'), 'destination' => $this->path('restore.sql.gz'), 'key' => $this->path('key')])->assertSuccessful();
        self::assertFileEquals($this->path('source'), $this->path('restore.sql.gz'));
    }

    private function assertRejected(string $archive): void
    {
        try {
            BackupCipher::decrypt($this->path($archive), $this->path('restored'), $this->path('key'));
            self::fail('Invalid archive must fail authentication.');
        } catch (RuntimeException) {
            self::assertFileDoesNotExist($this->path('restored'));
        }
    }

    private function path(string $file): string
    {
        return $this->directory.'/'.$file;
    }
}
