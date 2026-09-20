<?php
/**
 * Plugin Name: VULCANUS Bulk Paleta
 * Description: Samostatné WordPress podstránky Palivá, Paleta a Ako to predávame. Celý konfigurátor. Nie Woo. Solo produkty nemení.
 * Version: 2.2.1
 * Author: VULCANUS
 * Text Domain: vulcanus-bulk-paleta
 */

if (!defined('ABSPATH')) {
    exit;
}

define('VULCANUS_BULK_DIR', plugin_dir_path(__FILE__));
define('VULCANUS_BULK_URL', plugin_dir_url(__FILE__));

require_once VULCANUS_BULK_DIR . 'includes/pricing.php';
require_once VULCANUS_BULK_DIR . 'includes/order.php';
require_once VULCANUS_BULK_DIR . 'includes/html.php';
require_once VULCANUS_BULK_DIR . 'includes/pages.php';

register_activation_hook(__FILE__, function () {
    vulcanus_bulk_rewrites();
    vulcanus_bulk_ensure_pages();
    flush_rewrite_rules();
    update_option('vulcanus_bulk_pages_version', '2.1.0');
});

add_action('init', 'vulcanus_bulk_rewrites');
add_action('admin_init', function () {
    if (get_option('vulcanus_bulk_pages_version') === '2.1.0') {
        return;
    }
    vulcanus_bulk_rewrites();
    vulcanus_bulk_ensure_pages();
    flush_rewrite_rules();
    update_option('vulcanus_bulk_pages_version', '2.1.0');
});
function vulcanus_bulk_rewrites() {
    add_rewrite_rule('^paliva/?$', 'index.php?vulcanus_bulk=paliva', 'top');
    add_rewrite_rule('^objednavka-paleta/hotovo/?$', 'index.php?vulcanus_bulk=done', 'top');
    add_rewrite_rule('^objednavka-paleta/?$', 'index.php?vulcanus_bulk=paleta', 'top');
    add_rewrite_rule('^ako-to-predavame/?$', 'index.php?vulcanus_bulk=ako', 'top');
    add_rewrite_rule('^ako-to-funguje/?$', 'index.php?vulcanus_bulk=ako', 'top');
    add_rewrite_rule('^palivo/([^/]+)/?$', 'index.php?vulcanus_bulk=palivo&vulcanus_palivo=$matches[1]', 'top');
    add_rewrite_tag('%vulcanus_bulk%', '([^&]+)');
    add_rewrite_tag('%vulcanus_palivo%', '([^&]+)');
}

add_filter('query_vars', function ($vars) {
    $vars[] = 'vulcanus_bulk';
    $vars[] = 'vulcanus_palivo';
    return $vars;
});

add_action('template_redirect', function () {
    $page = vulcanus_bulk_current_page();
    if (!$page) {
        return;
    }
    status_header(200);
    nocache_headers();
    $palivo_slug = get_query_var('vulcanus_palivo');
    vulcanus_bulk_emit($page, $palivo_slug);
    exit;
}, -100);

add_action('rest_api_init', function () {
    register_rest_route('bulk-paleta/v1', '/quote', array(
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function (WP_REST_Request $request) {
            return vulcanus_bulk_quote(
                sanitize_text_field($request->get_param('fuelId')),
                (int) $request->get_param('kg'),
                sanitize_text_field($request->get_param('fulfillment') ?: 'pallet')
            );
        },
    ));
    register_rest_route('bulk-paleta/v1', '/order', array(
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => function (WP_REST_Request $request) {
            $json = $request->get_json_params();
            if (!is_array($json)) {
                return new WP_REST_Response(array('ok' => false, 'error' => 'Neplatné JSON.'), 400);
            }
            $result = vulcanus_bulk_create_order($json);
            return new WP_REST_Response($result, !empty($result['ok']) ? 200 : 400);
        },
    ));
});

function vulcanus_bulk_emit($page, $palivo_slug = '') {
    $map = array(
        'paliva' => array('Palivá', 'paliva.php'),
        'paleta' => array('Paletová objednávka', 'paleta.php'),
        'form' => array('Paletová objednávka', 'paleta.php'),
        'ako' => array('Ako to predávame', 'ako.php'),
        'done' => array('Objednávka', 'hotovo.php'),
        'palivo' => array('Palivo', 'palivo.php'),
    );
    if (!isset($map[$page])) {
        $page = 'paliva';
    }
    list($title, $file) = $map[$page];
    $nav = $page === 'form' || $page === 'done' ? 'paleta' : ($page === 'palivo' ? 'paliva' : $page);
    $content = include VULCANUS_BULK_DIR . 'templates/' . $file;
    vulcanus_render_document($nav, $title, $content);
}
