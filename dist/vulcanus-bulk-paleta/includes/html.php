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

function vulcanus_bulk_style_deps() {
    $deps = array();
    foreach (array(
        'bricks-default-content',
        'bricks-frontend',
        'vulcanus-g3-site',
        'vd-site-shell',
        'vd-shared-nav',
    ) as $handle) {
        if (wp_style_is($handle, 'registered') || wp_style_is($handle, 'enqueued')) {
            $deps[] = $handle;
        }
    }
    return $deps;
}

function vulcanus_bulk_enqueue_assets() {
    if (!function_exists('wp_enqueue_style')) {
        return;
    }
    wp_enqueue_style(
        'vulcanus-bulk-site',
        vulcanus_asset('site.css'),
        vulcanus_bulk_style_deps(),
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

function vulcanus_bulk_print_shop_width() {
    if (!function_exists('is_page') || !vulcanus_bulk_should_enqueue()) {
        return;
    }
    echo '<style id="vulcanus-bulk-shop-width">'
        . '#brx-content:has(.vulcanus-config),#brx-content.wordpress:has(.vulcanus-config){'
        . 'width:100%!important;max-width:none!important;margin:0 auto!important;padding:0!important;box-sizing:border-box!important}'
        . '.vulcanus-config{width:100%!important;max-width:1400px!important;margin-left:auto!important;margin-right:auto!important;padding:70px 5%!important;box-sizing:border-box!important}'
        . '@media(max-width:650px){.vulcanus-config{padding:45px 6%!important}}'
        . '</style>' . "\n";
}

function vulcanus_bulk_print_site_css_late() {
    if (!function_exists('is_page') || !vulcanus_bulk_should_enqueue()) {
        return;
    }
    echo '<link rel="stylesheet" id="vulcanus-bulk-site-late-css" href="'
        . vulcanus_e(vulcanus_asset('site.css'))
        . '?ver=' . vulcanus_e(VULCANUS_BULK_VERSION)
        . '&amp;late=1" media="all" />' . "\n";
}

if (function_exists('add_action')) {
    add_action('wp_head', 'vulcanus_bulk_print_shop_width', 99);
    add_action('wp_footer', 'vulcanus_bulk_print_site_css_late', 5);
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
