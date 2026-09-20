<?php
/**
 * Standalone front controller.
 * php -S 127.0.0.1:8765 standalone.php
 */
define('VULCANUS_BULK_STANDALONE', true);
require_once __DIR__ . '/includes/pricing.php';
require_once __DIR__ . '/includes/order.php';
require_once __DIR__ . '/includes/html.php';

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

$page = 'paliva';
$palivo_slug = '';
if ($uri === '/' || $uri === '/paliva' || $uri === '/paliva/') {
    $page = 'paliva';
} elseif (preg_match('#^/objednavka-paleta/hotovo#', $uri) || strpos($uri, '/hotovo') !== false) {
    $page = 'done';
} elseif (preg_match('#^/objednavka-paleta#', $uri)) {
    $page = 'paleta';
} elseif (preg_match('#^/ako-to-(predavame|funguje)#', $uri)) {
    $page = 'ako';
} elseif (preg_match('#^/palivo/([^/]+)#', $uri, $m)) {
    $page = 'palivo';
    $palivo_slug = $m[1];
}

$map = array(
    'paliva' => array('Palivá', 'paliva.php'),
    'paleta' => array('Paletová objednávka', 'paleta.php'),
    'ako' => array('Ako to predávame', 'ako.php'),
    'done' => array('Objednávka', 'hotovo.php'),
    'palivo' => array('Palivo', 'palivo.php'),
);
list($title, $file) = $map[$page];
$nav = $page === 'done' ? 'paleta' : ($page === 'palivo' ? 'paliva' : $page);
$content = include __DIR__ . '/templates/' . $file;
vulcanus_render_document($nav, $title, $content);
