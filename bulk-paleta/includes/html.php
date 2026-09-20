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

function vulcanus_bag_svg($fuel, $weight) {
    $fill = vulcanus_e($fuel['color'] ?? '#2a2723');
    $speck = vulcanus_e($fuel['speck'] ?? '#4a453c');
    $stitch = vulcanus_e($fuel['stitch'] ?? '#d4c4a8');
    $weight = (int) $weight;
    return '<svg viewBox="0 0 160 200" class="vulcanus-bag" role="img" aria-label="' . $weight . ' kg vrece">'
        . '<rect width="160" height="200" rx="18" fill="#cbb79a"/>'
        . '<rect x="10" y="10" width="140" height="180" rx="12" fill="#e7d7bc"/>'
        . '<path d="M28 48h104l-8 118H36Z" fill="' . $fill . '"/>'
        . '<circle cx="58" cy="92" r="5" fill="' . $speck . '" opacity="0.7"/>'
        . '<circle cx="92" cy="108" r="4" fill="' . $speck . '" opacity="0.55"/>'
        . '<circle cx="74" cy="128" r="6" fill="' . $speck . '" opacity="0.4"/>'
        . '<circle cx="108" cy="86" r="3.5" fill="' . $speck . '" opacity="0.5"/>'
        . '<path d="M40 58h80M44 160h72" stroke="' . $stitch . '" stroke-width="2" stroke-dasharray="4 6" opacity="0.8"/>'
        . '<rect x="48" y="70" width="64" height="36" rx="4" fill="#efe4d2"/>'
        . '<text x="80" y="93" text-anchor="middle" fill="#2a2218" font-family="ui-sans-serif,system-ui" font-size="16" font-weight="700">'
        . $weight . ' kg</text></svg>';
}

function vulcanus_nav_links() {
    return array(
        array('id' => 'paliva', 'href' => vulcanus_url('paliva'), 'label' => 'Palivá'),
        array('id' => 'paleta', 'href' => vulcanus_url('objednavka-paleta'), 'label' => 'Paleta'),
        array('id' => 'ako', 'href' => vulcanus_url('ako-to-predavame'), 'label' => 'Ako to predávame'),
    );
}

function vulcanus_render_document($page, $title, $content) {
    $nav = vulcanus_nav_links();
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    echo '<!doctype html><html lang="sk"><head>';
    echo '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<title>' . vulcanus_e($title) . ' · VULCANUS</title>';
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
    echo '<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">';
    echo '<link rel="stylesheet" href="' . vulcanus_e(vulcanus_asset('site.css')) . '?ver=2.2.5">';
    echo '</head><body class="vulcanus-site">';
    echo '<header class="vulcanus-header"><div class="vulcanus-wrap vulcanus-header-inner">';
    echo '<a class="vulcanus-brand" href="' . vulcanus_e(vulcanus_url('paliva')) . '">';
    echo '<img class="vulcanus-logo" src="' . vulcanus_e(vulcanus_asset('vulcanus-logo-white.png')) . '" alt="VULCANUS" width="252" height="28">';
    echo '</a>';
    echo '<nav class="vulcanus-nav">';
    foreach ($nav as $link) {
        $on = $link['id'] === $page ? ' is-on' : '';
        echo '<a class="vulcanus-nav-link' . $on . '" href="' . vulcanus_e($link['href']) . '">' . vulcanus_e($link['label']) . '</a>';
    }
    echo '</nav></div></header>';
    echo '<main class="vulcanus-wrap vulcanus-main">' . $content . '</main>';
    echo '<footer class="vulcanus-footer"><div class="vulcanus-wrap vulcanus-footer-grid">';
    echo '<div><p class="eyebrow light">Kde nás nájdete</p>';
    echo '<p><strong>Office a sklad povrchových úprav</strong><br>VULCANUS, s.r.o.<br>Smaragdová 619/7<br>010 09 Žilina</p>';
    echo '<p><strong>Sklad cortenu a uhlia</strong><br>VULCANUS, s.r.o.<br>Hollého 1174/18<br>014 01 Bytča</p></div>';
    echo '<div><p class="eyebrow light">Objednávky</p><p><a href="' . vulcanus_e(vulcanus_url('objednavka-paleta')) . '">Paletová objednávka</a></p>';
    echo '<p class="muted">Solo vrecia — košík. Od 100 kg — záväzná objednávka, nie košík.</p>';
    echo '<p class="muted">Paleta je jednorazová, nevratná a v cene tovaru.</p></div>';
    echo '<div><p class="eyebrow light">Kontakty</p><p class="muted">Info a podpora: 09:00 – 17:30<br>Osobný odber treba dohodnúť vopred telefonicky.</p>';
    echo '<p><a href="tel:+421911365598">+421 911 36 55 98</a></p>';
    echo '<p><a href="mailto:office@vulcanus.sk">office@vulcanus.sk</a></p></div>';
    echo '</div><p class="vulcanus-copy">Dobierka nie je v cene tovaru. <a href="' . vulcanus_e(vulcanus_url('ako-to-predavame')) . '">Ako je katalóg poskladaný</a></p>';
    echo '</footer>';
    echo '<script src="' . vulcanus_e(vulcanus_asset('configurator.js')) . '?ver=2.2.5"></script>';
    echo '</body></html>';
}

function vulcanus_bulk_enqueue_assets() {
    wp_enqueue_style(
        'vulcanus-bulk-site',
        vulcanus_asset('site.css'),
        array(),
        '2.2.5'
    );
    wp_enqueue_script(
        'vulcanus-bulk-configurator',
        vulcanus_asset('configurator.js'),
        array(),
        '2.2.5',
        true
    );
}

function vulcanus_render_in_theme($page, $title, $content) {
    if (!function_exists('get_header') || !function_exists('get_footer')) {
        vulcanus_render_document($page, $title, $content);
        return;
    }
    vulcanus_bulk_enqueue_assets();
    add_filter('pre_get_document_title', function () use ($title) {
        $site = wp_strip_all_tags(get_bloginfo('name'));
        return $site ? $title . ' · ' . $site : $title;
    }, 99);
    get_header();
    echo '<div class="vulcanus-main">' . $content . '</div>';
    get_footer();
}
