<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}

function vulcanus_url($path = '') {
    $path = ltrim($path, '/');
    if (defined('VULCANUS_BULK_STANDALONE') && VULCANUS_BULK_STANDALONE) {
        return $path === '' ? '/' : '/' . $path;
    }
    return home_url('/' . $path);
}

function vulcanus_asset($file) {
    if (defined('VULCANUS_BULK_STANDALONE') && VULCANUS_BULK_STANDALONE) {
        return '/assets/' . ltrim($file, '/');
    }
    return VULCANUS_BULK_URL . 'assets/' . ltrim($file, '/');
}

function vulcanus_e($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function vulcanus_bulk_enqueue_assets() {
    if (!function_exists('wp_enqueue_style')) {
        return;
    }
    wp_enqueue_style(
        'vulcanus-bulk-site',
        vulcanus_asset('site.css'),
        array(),
        VULCANUS_BULK_VERSION
    );
    wp_enqueue_script(
        'vulcanus-bulk-configurator',
        vulcanus_asset('configurator.js'),
        array(),
        VULCANUS_BULK_VERSION,
        true
    );
}

/** Local PHP preview only. WordPress must never call this. */
function vulcanus_render_document($title, $content) {
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    echo '<!doctype html><html lang="sk"><head>';
    echo '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<title>' . vulcanus_e($title) . '</title>';
    echo '<link rel="stylesheet" href="' . vulcanus_e(vulcanus_asset('site.css')) . '?ver=' . vulcanus_e(VULCANUS_BULK_VERSION) . '">';
    echo '</head><body class="vulcanus-site">';
    echo '<main class="vulcanus-wrap vulcanus-main">' . $content . '</main>';
    echo '<script src="' . vulcanus_e(vulcanus_asset('configurator.js')) . '?ver=' . vulcanus_e(VULCANUS_BULK_VERSION) . '"></script>';
    echo '</body></html>';
}
