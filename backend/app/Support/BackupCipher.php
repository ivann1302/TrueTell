<?php

declare(strict_types=1);

namespace App\Support;

use RuntimeException;
use Throwable;

final class BackupCipher
{
    private const MAGIC = "TTCRM\x01\r\n";

    private const CHUNK = 65536;

    public static function encrypt(string $input, string $output, string $keyFile): void
    {
        self::transform($input, $output, $keyFile, true);
    }

    public static function decrypt(string $input, string $output, string $keyFile): void
    {
        self::transform($input, $output, $keyFile, false);
    }

    private static function transform(string $input, string $output, string $keyFile, bool $encrypt): void
    {
        $material = file_get_contents($keyFile);
        if ($material === false || strlen($material) < 64) {
            throw new RuntimeException('Invalid backup key.');
        }
        $key = sodium_crypto_generichash($material, '', SODIUM_CRYPTO_SECRETSTREAM_XCHACHA20POLY1305_KEYBYTES);
        sodium_memzero($material);
        $source = fopen($input, 'rb');
        if ($source === false) {
            throw new RuntimeException('Cannot read backup input.');
        }
        $destination = false;
        $oldMask = umask(0077);
        try {
            $destination = @fopen($output, 'xb');
            if ($destination === false) {
                throw new RuntimeException('Backup destination must not exist.');
            }
            if (! chmod($output, 0600)) {
                throw new RuntimeException('Cannot secure backup destination.');
            }
            if ($encrypt) {
                [$state, $header] = sodium_crypto_secretstream_xchacha20poly1305_init_push($key);
                self::write($destination, self::MAGIC.$header);
                while (! feof($source)) {
                    $chunk = fread($source, self::CHUNK);
                    if ($chunk === false) {
                        throw new RuntimeException('Cannot read backup input.');
                    }
                    if ($chunk !== '') {
                        $frame = sodium_crypto_secretstream_xchacha20poly1305_push($state, $chunk);
                        self::write($destination, pack('N', strlen($frame)).$frame);
                    }
                }
                $frame = sodium_crypto_secretstream_xchacha20poly1305_push($state, '', '', SODIUM_CRYPTO_SECRETSTREAM_XCHACHA20POLY1305_TAG_FINAL);
                self::write($destination, pack('N', strlen($frame)).$frame);
            } else {
                if (self::read($source, strlen(self::MAGIC)) !== self::MAGIC) {
                    throw new RuntimeException('Unsupported backup format.');
                }
                $state = sodium_crypto_secretstream_xchacha20poly1305_init_pull(self::read($source, SODIUM_CRYPTO_SECRETSTREAM_XCHACHA20POLY1305_HEADERBYTES), $key);
                while (true) {
                    $length = unpack('Nlength', self::read($source, 4));
                    $size = $length === false ? null : $length['length'];
                    if (! is_int($size) || $size < SODIUM_CRYPTO_SECRETSTREAM_XCHACHA20POLY1305_ABYTES || $size > self::CHUNK + SODIUM_CRYPTO_SECRETSTREAM_XCHACHA20POLY1305_ABYTES) {
                        throw new RuntimeException('Invalid backup frame.');
                    }
                    $result = sodium_crypto_secretstream_xchacha20poly1305_pull($state, self::read($source, $size));
                    if ($result === false) {
                        throw new RuntimeException('Backup authentication failed.');
                    }
                    [$plain, $tag] = $result;
                    if ($tag === SODIUM_CRYPTO_SECRETSTREAM_XCHACHA20POLY1305_TAG_FINAL) {
                        if ($plain !== '' || fread($source, 1) !== '') {
                            throw new RuntimeException('Invalid backup ending.');
                        }
                        break;
                    }
                    if ($tag !== SODIUM_CRYPTO_SECRETSTREAM_XCHACHA20POLY1305_TAG_MESSAGE) {
                        throw new RuntimeException('Invalid backup tag.');
                    }
                    self::write($destination, $plain);
                }
            }
            if (! fflush($destination)) {
                throw new RuntimeException('Cannot flush backup output.');
            }
        } catch (Throwable $exception) {
            if (is_resource($destination)) {
                fclose($destination);
                $destination = false;
                unlink($output);
            }
            throw $exception;
        } finally {
            fclose($source);
            if (is_resource($destination)) {
                fclose($destination);
            }
            sodium_memzero($key);
            umask($oldMask);
        }
    }

    /** @param resource $stream */
    private static function read($stream, int $length): string
    {
        $result = '';
        while (($remaining = $length - strlen($result)) > 0) {
            $chunk = fread($stream, $remaining);
            if ($chunk === false || $chunk === '') {
                throw new RuntimeException('Truncated backup.');
            }
            $result .= $chunk;
        }

        return $result;
    }

    /** @param resource $stream */
    private static function write($stream, string $value): void
    {
        while ($value !== '') {
            $written = fwrite($stream, $value);
            if ($written === false || $written === 0) {
                throw new RuntimeException('Cannot write backup output.');
            }
            $value = substr($value, $written);
        }
    }
}
