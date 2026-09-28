<?php

declare(strict_types=1);

// public_html/crm/index.php -> private sibling backend/ (never upload backend inside public_html).
$backend = dirname(__DIR__, 2).'/backend';
if (!is_file($backend.'/vendor/autoload.php') || !is_file($backend.'/.env')) {
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    echo json_encode(['message' => 'Приём заявок временно недоступен. Попробуйте позже.'], JSON_UNESCAPED_UNICODE);
    exit;
}
require $backend.'/public/index.php';
