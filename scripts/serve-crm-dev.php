<?php

declare(strict_types=1);
// Local development only. Serves the production Astro build and Laravel on one origin.
$root = dirname(__DIR__);
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (is_string($path) && (preg_match('~^/workspace(?:/|$)~', $path) || in_array($path, ['/api/leads', '/api/lead-session'], true))) {
    require $root.'/backend/public/index.php';
    return true;
}
$file = realpath($root.'/dist'.rawurldecode(is_string($path) ? $path : '/'));
if ($file && str_starts_with($file, $root.'/dist/') && is_file($file) && !str_ends_with($file, '.php')) {
    $mime = ['css'=>'text/css', 'js'=>'application/javascript', 'html'=>'text/html', 'svg'=>'image/svg+xml', 'webp'=>'image/webp', 'png'=>'image/png', 'woff2'=>'font/woff2'];
    header('Content-Type: '.($mime[pathinfo($file, PATHINFO_EXTENSION)] ?? 'application/octet-stream'));
    readfile($file);
    return true;
}
if ($file && str_starts_with($file, $root.'/dist') && is_dir($file) && is_file($file.'/index.html')) {
    header('Content-Type: text/html; charset=utf-8'); readfile($file.'/index.html'); return true;
}
http_response_code(404); echo 'Not found';return true;
