<?php
/**
 * Standalone front controller for smoke tests without WordPress.
 * php -S 127.0.0.1:8765 standalone.php
 */
define('VULCANUS_BULK_STANDALONE', true);
require_once __DIR__ . '/includes/pricing.php';
require_once __DIR__ . '/includes/order.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

header('Cache-Control: no-store');

if (preg_match('#/assets/(.+)$#', $uri, $m)) {
    $file = __DIR__ . '/assets/' . basename($m[1]);
    if (!is_file($file)) {
        http_response_code(404);
        exit;
    }
    $types = array('css' => 'text/css', 'js' => 'application/javascript');
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    header('Content-Type: ' . ($types[$ext] ?? 'text/plain'));
    readfile($file);
    exit;
}

if ($uri === '/quote' || $uri === '/quote/') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(vulcanus_bulk_quote(
        isset($_GET['fuelId']) ? $_GET['fuelId'] : 'uhlie',
        isset($_GET['kg']) ? (int) $_GET['kg'] : 100,
        isset($_GET['fulfillment']) ? $_GET['fulfillment'] : 'pallet'
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

if (($uri === '/order' || $uri === '/order/') && $method === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $raw = json_decode(file_get_contents('php://input'), true);
    if (!is_array($raw)) {
        http_response_code(400);
        echo json_encode(array('ok' => false, 'error' => 'Neplatné JSON.'));
        exit;
    }
    $result = vulcanus_bulk_create_order($raw);
    http_response_code(!empty($result['ok']) ? 200 : 400);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
}

if (strpos($uri, '/hotovo') !== false) {
    $order = isset($_GET['order']) ? htmlspecialchars($_GET['order'], ENT_QUOTES, 'UTF-8') : '';
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="sk"><meta charset="utf-8"><title>Objednávka</title>';
    echo '<link rel="stylesheet" href="/assets/configurator.css">';
    echo '<div class="vulcanus-bulk"><div class="vulcanus-card vulcanus-done">';
    echo '<p class="eyebrow">Objednávka</p><h1>' . ($order ?: 'Odoslané') . '</h1>';
    echo '<p>Záväzná paletová objednávka. Nie Woo košík.</p>';
    echo '<p><a href="/objednavka-paleta">Späť na konfigurátor</a></p></div></div></html>';
    exit;
}

header('Content-Type: text/html; charset=utf-8');
$order_url = '/order';
$done_url = '/hotovo';
$asset_css = '/assets/configurator.css';
$asset_js = '/assets/configurator.js';
echo '<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paletový konfigurátor</title></head><body>';
include __DIR__ . '/templates/configurator.php';
echo '</body></html>';
