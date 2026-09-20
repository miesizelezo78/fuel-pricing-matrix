<?php
if (!defined('ABSPATH')) {
    exit;
}

function vulcanus_bulk_find_page_id($slug, $parent = 0) {
    $query = array(
        'name' => $slug,
        'post_type' => 'page',
        'post_status' => array('publish', 'draft', 'private', 'pending'),
        'numberposts' => 1,
    );
    if ($parent) {
        $query['post_parent'] = $parent;
    }
    $found = get_posts($query);
    return $found ? (int) $found[0]->ID : 0;
}

function vulcanus_bulk_ensure_pages() {
    $ids = array();
    $paleta_id = vulcanus_bulk_find_page_id('objednavka-paleta');
    if (!$paleta_id) {
        $paleta_id = wp_insert_post(array(
            'post_title' => 'Kováčske palivá od 100 kg',
            'post_name' => 'objednavka-paleta',
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_content' => '[vulcanus_paleta]',
            'comment_status' => 'closed',
            'ping_status' => 'closed',
        ), true);
    }
    if (!is_wp_error($paleta_id) && $paleta_id) {
        $ids['objednavka-paleta'] = (int) $paleta_id;
        update_post_meta((int) $paleta_id, '_vulcanus_bulk_page', 'paleta');
        $existing = get_post($paleta_id);
        if ($existing && $existing->post_title === 'Paletová objednávka') {
            wp_update_post(array(
                'ID' => (int) $paleta_id,
                'post_title' => 'Kováčske palivá od 100 kg',
            ));
        }
    }

    if (!empty($ids['objednavka-paleta'])) {
        $parent = $ids['objednavka-paleta'];
        $done_id = vulcanus_bulk_find_page_id('hotovo', $parent);
        if (!$done_id) {
            $done_id = vulcanus_bulk_find_page_id('hotovo');
        }
        if (!$done_id) {
            $done_id = wp_insert_post(array(
                'post_title' => 'Objednávka odoslaná',
                'post_name' => 'hotovo',
                'post_parent' => $parent,
                'post_status' => 'publish',
                'post_type' => 'page',
                'post_content' => '[vulcanus_paleta_hotovo]',
                'comment_status' => 'closed',
                'ping_status' => 'closed',
            ), true);
        }
        if (!is_wp_error($done_id) && $done_id) {
            $ids['hotovo'] = (int) $done_id;
            update_post_meta((int) $done_id, '_vulcanus_bulk_page', 'done');
        }
    }

    return $ids;
}

function vulcanus_bulk_request_path() {
    $path = parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/', PHP_URL_PATH);
    $path = trim((string) $path, '/');
    $home = parse_url(home_url('/'), PHP_URL_PATH);
    $home = trim((string) $home, '/');
    if ($home !== '' && $path === $home) {
        return '';
    }
    if ($home !== '' && strpos($path, $home . '/') === 0) {
        $path = trim(substr($path, strlen($home)), '/');
    }
    return $path;
}

function vulcanus_bulk_dead_end_redirects() {
    $path = vulcanus_bulk_request_path();
    $shop = vulcanus_fuels_shop_url();
    $hub = vulcanus_fuels_hub_url();

    if ($path === 'paliva' || (function_exists('is_page') && is_page('paliva'))) {
        wp_redirect($shop, 301);
        exit;
    }
    if (
        $path === 'ako-to-predavame'
        || $path === 'ako-to-funguje'
        || (function_exists('is_page') && (is_page('ako-to-predavame') || is_page('ako-to-funguje')))
    ) {
        wp_redirect($hub, 301);
        exit;
    }
    if (preg_match('#^palivo/([^/]+)#', $path, $m)) {
        $slug = $m[1];
        $fuel = 'uhlie';
        if (strpos($slug, 'antracit') !== false) {
            $fuel = 'antracit';
        } elseif (strpos($slug, 'koks') !== false) {
            $fuel = 'koks';
        }
        wp_redirect(vulcanus_woo_product_url($fuel), 301);
        exit;
    }
}
