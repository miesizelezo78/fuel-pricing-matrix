<?php
/**
 * Plugin Name: VULCANUS Bulk Paleta
 * Description: Konfigurátor paletovej objednávky od 100 kg. Shortcode [vulcanus_paleta] do existujúceho G3 chrome. Vrecia s doručením (Woo) nemení.
 * Version: 2.3.12
 * Author: VULCANUS
 * Text Domain: vulcanus-bulk-paleta
 */

if (!defined('ABSPATH')) {
    exit;
}

define('VULCANUS_BULK_DIR', plugin_dir_path(__FILE__));
define('VULCANUS_BULK_URL', plugin_dir_url(__FILE__));
define('VULCANUS_BULK_VERSION', '2.3.12');

require_once VULCANUS_BULK_DIR . 'includes/pricing.php';
require_once VULCANUS_BULK_DIR . 'includes/order.php';
require_once VULCANUS_BULK_DIR . 'includes/html.php';
require_once VULCANUS_BULK_DIR . 'includes/urls.php';
require_once VULCANUS_BULK_DIR . 'includes/pages.php';

register_activation_hook(__FILE__, function () {
    vulcanus_bulk_ensure_pages();
    flush_rewrite_rules();
    update_option('vulcanus_bulk_pages_version', VULCANUS_BULK_VERSION);
});

add_action('admin_init', function () {
    if (get_option('vulcanus_bulk_pages_version') === VULCANUS_BULK_VERSION) {
        return;
    }
    vulcanus_bulk_ensure_pages();
    flush_rewrite_rules();
    update_option('vulcanus_bulk_pages_version', VULCANUS_BULK_VERSION);
});

add_action('wp_enqueue_scripts', function () {
    if (vulcanus_bulk_should_enqueue()) {
        vulcanus_bulk_enqueue_assets();
    }
}, 999);

add_shortcode('vulcanus_paleta', function () {
    vulcanus_bulk_enqueue_assets();
    return vulcanus_bulk_template('paleta.php');
});

add_shortcode('vulcanus_paleta_hotovo', function () {
    vulcanus_bulk_enqueue_assets();
    return vulcanus_bulk_template('hotovo.php');
});

add_shortcode('vulcanus_paleta_karty', function ($atts) {
    vulcanus_bulk_enqueue_assets();
    $atts = shortcode_atts(array('kanal' => 'bulk'), $atts ?: array());
    $GLOBALS['vulcanus_karty_channel'] = $atts['kanal'] === 'all' ? 'all' : 'bulk';
    return vulcanus_bulk_template('karty.php');
});

add_action('template_redirect', 'vulcanus_bulk_dead_end_redirects', 1);

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

function vulcanus_bulk_template($file) {
    $path = VULCANUS_BULK_DIR . 'templates/' . $file;
    if (!is_file($path)) {
        return '';
    }
    $content = include $path;
    return is_string($content) ? $content : '';
}

function vulcanus_bulk_should_enqueue() {
    if (is_page('objednavka-paleta') || is_page('hotovo')) {
        return true;
    }
    global $post;
    if (!$post || empty($post->post_content)) {
        return false;
    }
    foreach (array('vulcanus_paleta', 'vulcanus_paleta_hotovo', 'vulcanus_paleta_karty') as $tag) {
        if (has_shortcode($post->post_content, $tag)) {
            return true;
        }
    }
    return false;
}

add_filter('document_title_parts', function ($parts) {
    if (function_exists('is_page') && is_page('objednavka-paleta')) {
        $parts['title'] = 'Kováčske palivá od 100 kg';
    }
    return $parts;
});

