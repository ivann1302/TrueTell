<?php

declare(strict_types=1);

return [
    'brand' => (json_decode((string) file_get_contents(__DIR__.'/company.json'), true, 512, JSON_THROW_ON_ERROR))['brandName'],
    'consent_version' => '2026-09-28',
    'telegram' => [
        'enabled' => (bool) env('TELEGRAM_ENABLED', false),
        'token' => env('TELEGRAM_BOT_TOKEN', ''),
        'recipients' => array_values(array_unique(array_filter(array_map('trim', explode(',', (string) env('TELEGRAM_CHAT_IDS', '')))))),
    ],
];
