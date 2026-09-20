<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}

function vulcanus_site_base() {
    if (defined('VULCANUS_BULK_STANDALONE') && VULCANUS_BULK_STANDALONE) {
        return 'https://staging.vulcanus.sk';
    }
    return untrailingslashit(home_url());
}

function vulcanus_fuels_hub_url() {
    return vulcanus_site_base() . '/kovacske-paliva/';
}

function vulcanus_fuels_shop_url() {
    return vulcanus_site_base() . '/?ukazka=obchod&rodina=kovacske-paliva';
}

function vulcanus_woo_product_path($fuel_id) {
    $map = array(
        'uhlie' => '/produkt/kovacske-cierne-uhlie-25-kg',
        'antracit' => '/produkt/kovacsky-antracit-25-kg',
        'koks' => '/produkt/kovacsky-koks-20-kg',
    );
    return isset($map[$fuel_id]) ? $map[$fuel_id] : '/?ukazka=obchod&rodina=kovacske-paliva';
}

function vulcanus_woo_product_url($fuel_id) {
    return vulcanus_site_base() . vulcanus_woo_product_path($fuel_id);
}

function vulcanus_pallet_url($fuel_id = '', $kg = 0) {
    $url = vulcanus_url('objednavka-paleta');
    $params = array();
    if ($fuel_id === 'uhlie' || $fuel_id === 'antracit' || $fuel_id === 'koks') {
        $params['palivo'] = $fuel_id;
    }
    if ($kg > 0) {
        $params['kg'] = (int) $kg;
    }
    if (!$params) {
        return $url;
    }
    return $url . (strpos($url, '?') === false ? '?' : '&') . http_build_query($params);
}

function vulcanus_fuel_image_url() {
    $default = vulcanus_site_base() . '/wp-content/uploads/2026/09/kovacske-paliva-vyhen.jpg';
    if (function_exists('apply_filters')) {
        return apply_filters('vulcanus_bulk_fuel_image', $default);
    }
    return $default;
}

function vulcanus_woo_card_copy($fuel_id, $channel) {
    $solo = array(
        'uhlie' => array(
            'name' => 'Kováčske čierne uhlie – 25 kg s doručením',
            'subtitle' => 'Kováčske čierne uhlie v 25 kg balení. Zrnitosť 10–30 mm.',
            'pack' => 'Vrece · 25 kg',
        ),
        'antracit' => array(
            'name' => 'Kováčsky antracit – 25 kg s doručením',
            'subtitle' => 'Antracit v 25 kg balení. Zrnitosť 10–20 mm.',
            'pack' => 'Vrece · 25 kg',
        ),
        'koks' => array(
            'name' => 'Kováčsky koks – 20 kg s doručením',
            'subtitle' => 'Kováčsky koks v 20 kg balení. Zrnitosť 10–20 mm.',
            'pack' => 'Vrece · 20 kg',
        ),
    );
    $bulk = array(
        'uhlie' => array(
            'name' => 'Kováčske čierne uhlie – od 100 kg',
            'subtitle' => 'Tovar na objednávku, nie do košíka. Od 4 vriec (100 kg).',
            'pack' => 'Na objednávku · od 100 kg',
        ),
        'antracit' => array(
            'name' => 'Kováčsky antracit – od 100 kg',
            'subtitle' => 'Tovar na objednávku, nie do košíka. Od 4 vriec (100 kg).',
            'pack' => 'Na objednávku · od 100 kg',
        ),
        'koks' => array(
            'name' => 'Kováčsky koks – od 100 kg',
            'subtitle' => 'Tovar na objednávku, nie do košíka. Od 5 vriec (100 kg).',
            'pack' => 'Na objednávku · od 100 kg',
        ),
    );
    $set = $channel === 'solo' ? $solo : $bulk;
    return isset($set[$fuel_id]) ? $set[$fuel_id] : $set['uhlie'];
}

function vulcanus_echo_fuel_card($fuel_id, $channel, $img) {
    $copy = vulcanus_woo_card_copy($fuel_id, $channel);
    $is_solo = $channel === 'solo';
    $href = $is_solo ? vulcanus_woo_product_url($fuel_id) : vulcanus_pallet_url($fuel_id);
    $action = $is_solo ? 'Pozrieť produkt' : 'K objednávke';
    $label = $is_solo ? 'Pozrieť ' . $copy['name'] : 'Objednať ' . $copy['name'];
    echo '<article class="vd-card" data-kind="kovacske-paliva" data-name="' . vulcanus_e($copy['name']) . '">';
    echo '<a class="vd-card-image v-g3-clip v-g3--md" href="' . vulcanus_e($href) . '">';
    echo '<img width="300" height="300" src="' . vulcanus_e($img) . '" alt="' . vulcanus_e($copy['name']) . '" loading="lazy">';
    echo '</a>';
    echo '<div class="vd-card-head">';
    echo '<p class="vd-eyebrow">Kováčske palivá</p>';
    echo '<h3><a href="' . vulcanus_e($href) . '">' . vulcanus_e($copy['name']) . '</a></h3>';
    echo '<p class="vd-card-subtitle">' . vulcanus_e($copy['subtitle']) . '</p>';
    echo '<p class="vd-card-pack">' . vulcanus_e($copy['pack']) . '</p>';
    echo '</div>';
    echo '<div class="vd-card-foot"><div class="vd-card-bottom">';
    if ($is_solo) {
        echo '<p class="vd-card-stock">s doručením</p>';
    } else {
        echo '<p class="vd-card-stock">Cena podľa množstva</p>';
    }
    echo '<div class="vd-card-actions">';
    $btn = $is_solo ? 'vd-card-action vd-card-action--view v-g3 v-g3--sm' : 'vd-card-action vd-card-action--cart v-g3 v-g3--sm v-g3--primary';
    echo '<a class="' . $btn . '" href="' . vulcanus_e($href) . '" aria-label="' . vulcanus_e($label) . '">' . vulcanus_e($action) . ' <i class="vd-right-mark" aria-hidden="true"></i></a>';
    echo '</div></div></div></article>';
}
