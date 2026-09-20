<?php
if (!defined('ABSPATH')) {
    exit;
}

function vulcanus_bulk_page_defs() {
    return array(
        array(
            'slug' => 'paliva',
            'title' => 'Palivá',
            'page' => 'paliva',
        ),
        array(
            'slug' => 'objednavka-paleta',
            'title' => 'Paleta',
            'page' => 'paleta',
        ),
        array(
            'slug' => 'ako-to-predavame',
            'title' => 'Ako to predávame',
            'page' => 'ako',
        ),
    );
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
    foreach (vulcanus_bulk_page_defs() as $def) {
        $id = vulcanus_bulk_find_page_id($def['slug']);
        $payload = array(
            'post_title' => $def['title'],
            'post_name' => $def['slug'],
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_content' => "<!-- wp:paragraph --><p>Túto podstránku kreslí modul VULCANUS Bulk Paleta. Nie je to Woo produkt.</p><!-- /wp:paragraph -->",
            'comment_status' => 'closed',
            'ping_status' => 'closed',
        );
        if (!$id) {
            $id = wp_insert_post($payload, true);
            if (is_wp_error($id)) {
                continue;
            }
        } else {
            $payload['ID'] = $id;
            wp_update_post($payload);
        }
        $ids[$def['slug']] = (int) $id;
        update_post_meta((int) $id, '_vulcanus_bulk_page', $def['page']);
    }

    if (!empty($ids['objednavka-paleta'])) {
        $parent = $ids['objednavka-paleta'];
        $done_id = vulcanus_bulk_find_page_id('hotovo', $parent);
        if (!$done_id) {
            $done_id = vulcanus_bulk_find_page_id('hotovo');
        }
        $done_payload = array(
            'post_title' => 'Objednávka odoslaná',
            'post_name' => 'hotovo',
            'post_parent' => $parent,
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_content' => "<!-- wp:paragraph --><p>Potvrdenie paletovej objednávky. Nie Woo.</p><!-- /wp:paragraph -->",
            'comment_status' => 'closed',
            'ping_status' => 'closed',
        );
        if (!$done_id) {
            $done_id = wp_insert_post($done_payload, true);
        } else {
            $done_payload['ID'] = $done_id;
            wp_update_post($done_payload);
        }
        if (!is_wp_error($done_id) && $done_id) {
            $ids['hotovo'] = (int) $done_id;
            update_post_meta((int) $done_id, '_vulcanus_bulk_page', 'done');
        }
    }

    vulcanus_bulk_ensure_menu($ids);
    return $ids;
}

function vulcanus_bulk_ensure_menu($page_ids) {
    if (!is_array($page_ids) || empty($page_ids)) {
        return;
    }

    $menu_name = 'VULCANUS Palivá';
    $menu = wp_get_nav_menu_object($menu_name);
    $own_id = $menu ? (int) $menu->term_id : 0;
    if (!$own_id) {
        $created = wp_create_nav_menu($menu_name);
        if (!is_wp_error($created)) {
            $own_id = (int) $created;
        }
    }

    $locations = get_nav_menu_locations();
    $target_id = $own_id;
    foreach (array('primary', 'primary-menu', 'menu-1', 'main', 'header', 'main-menu') as $loc) {
        if (!empty($locations[$loc])) {
            $target_id = (int) $locations[$loc];
            break;
        }
    }
    $menu_ids = array_unique(array_filter(array($own_id, $target_id)));

    foreach ($menu_ids as $menu_id) {
        $existing = wp_get_nav_menu_items($menu_id) ?: array();
        $have = array();
        foreach ($existing as $item) {
            if ($item->object === 'page') {
                $have[(int) $item->object_id] = true;
            }
            if (!empty($item->url)) {
                $have[untrailingslashit($item->url)] = true;
            }
        }
        $position = is_array($existing) ? count($existing) + 1 : 1;
        foreach (array('paliva', 'objednavka-paleta', 'ako-to-predavame') as $slug) {
            if (empty($page_ids[$slug])) {
                continue;
            }
            $id = (int) $page_ids[$slug];
            $url = untrailingslashit(get_permalink($id));
            if (!empty($have[$id]) || (!empty($url) && !empty($have[$url]))) {
                continue;
            }
            wp_update_nav_menu_item($menu_id, 0, array(
                'menu-item-object-id' => $id,
                'menu-item-object' => 'page',
                'menu-item-type' => 'post_type',
                'menu-item-status' => 'publish',
                'menu-item-position' => $position,
                'menu-item-title' => $slug === 'paliva' ? 'Palivá' : ($slug === 'objednavka-paleta' ? 'Paleta' : 'Ako to predávame'),
            ));
            $position++;
        }
    }

    $mods = get_theme_mod('nav_menu_locations');
    if (!is_array($mods)) {
        $mods = array();
    }
    $assigned = false;
    foreach (array('primary', 'primary-menu', 'menu-1', 'main', 'header', 'main-menu') as $loc) {
        if (!empty($mods[$loc])) {
            $assigned = true;
            break;
        }
    }
    if (!$assigned && $own_id) {
        $mods['primary'] = $own_id;
        set_theme_mod('nav_menu_locations', $mods);
    }
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

function vulcanus_bulk_current_page() {
    $qv = get_query_var('vulcanus_bulk');
    if ($qv) {
        return $qv;
    }

    if (function_exists('is_page') && is_page()) {
        $meta = get_post_meta(get_queried_object_id(), '_vulcanus_bulk_page', true);
        if ($meta === 'paliva' || $meta === 'paleta' || $meta === 'ako' || $meta === 'done') {
            return $meta;
        }
        if (is_page('paliva')) {
            return 'paliva';
        }
        if (is_page('ako-to-predavame') || is_page('ako-to-funguje')) {
            return 'ako';
        }
        if (is_page('objednavka-paleta')) {
            return 'paleta';
        }
        if (is_page('hotovo')) {
            return 'done';
        }
    }

    $path = vulcanus_bulk_request_path();
    if ($path === 'paliva') {
        return 'paliva';
    }
    if (preg_match('#^objednavka-paleta/hotovo#', $path)) {
        return 'done';
    }
    if ($path === 'objednavka-paleta') {
        return 'paleta';
    }
    if ($path === 'ako-to-predavame' || $path === 'ako-to-funguje') {
        return 'ako';
    }
    if (preg_match('#^palivo/([^/]+)#', $path, $m)) {
        set_query_var('vulcanus_palivo', $m[1]);
        return 'palivo';
    }
    return '';
}
