<?php
/**
 * Plugin Name: VULCANUS Bulk Paleta
 * Description: Paletový konfigurátor od 100 kg so živým prepočtom. Nie Woo košík. Solo produkty nemení.
 * Version: 1.1.0
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

register_activation_hook(__FILE__, function () {
    vulcanus_bulk_rewrites();
    flush_rewrite_rules();
});

add_action('init', 'vulcanus_bulk_rewrites');
function vulcanus_bulk_rewrites() {
    add_rewrite_rule('^objednavka-paleta/hotovo/?$', 'index.php?vulcanus_bulk=done', 'top');
    add_rewrite_rule('^objednavka-paleta/?$', 'index.php?vulcanus_bulk=form', 'top');
    add_rewrite_tag('%vulcanus_bulk%', '([^&]+)');
}

add_filter('query_vars', function ($vars) {
    $vars[] = 'vulcanus_bulk';
    return $vars;
});

add_shortcode('vulcanus_bulk_paleta', 'vulcanus_bulk_shortcode');
function vulcanus_bulk_shortcode() {
    ob_start();
    vulcanus_bulk_render_form();
    return ob_get_clean();
}

add_action('template_redirect', function () {
    $page = get_query_var('vulcanus_bulk');
    if ($page === 'form') {
        status_header(200);
        vulcanus_bulk_print_layout('form');
        exit;
    }
    if ($page === 'done') {
        status_header(200);
        vulcanus_bulk_print_layout('done');
        exit;
    }
});

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
            $status = !empty($result['ok']) ? 200 : 400;
            return new WP_REST_Response($result, $status);
        },
    ));
});

function vulcanus_bulk_render_form() {
    $order_url = rest_url('bulk-paleta/v1/order');
    $done_url = home_url('/objednavka-paleta/hotovo');
    $asset_css = VULCANUS_BULK_URL . 'assets/configurator.css';
    $asset_js = VULCANUS_BULK_URL . 'assets/configurator.js';
    include VULCANUS_BULK_DIR . 'templates/configurator.php';
}

function vulcanus_bulk_print_layout($which) {
    get_header();
    echo '<main class="vulcanus-bulk-main">';
    if ($which === 'done') {
        $order = isset($_GET['order']) ? sanitize_text_field(wp_unslash($_GET['order'])) : '';
        echo '<div class="vulcanus-bulk"><div class="vulcanus-card vulcanus-done">';
        echo '<p class="eyebrow">Objednávka</p>';
        echo '<h1>' . esc_html($order ? $order : 'Objednávka odoslaná') . '</h1>';
        echo '<p>Záväzná paletová objednávka. Solo Woo košík sa nemení.</p>';
        echo '<p><a href="' . esc_url(home_url('/objednavka-paleta')) . '">Späť na konfigurátor</a></p>';
        echo '</div></div>';
    } else {
        vulcanus_bulk_render_form();
    }
    echo '</main>';
    get_footer();
}
