<?php
/**
 * Local preview only: php -S 127.0.0.1:8765 standalone.php
 * WordPress uses shortcodes, never this file.
 */
define('VULCANUS_BULK_STANDALONE', true);
define('VULCANUS_BULK_VERSION', '2.3.0');
require_once __DIR__ . '/includes/pricing.php';
require_once __DIR__ . '/includes/order.php';
require_once __DIR__ . '/includes/html.php';
require_once __DIR__ . '/includes/urls.php';

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

if ($uri === '/paliva' || $uri === '/paliva/') {
    $GLOBALS['vulcanus_karty_channel'] = 'all';
    $content = include __DIR__ . '/templates/karty.php';
    $note = '<p class="lead">Lokálny náhľad kariet. Na webe /paliva/ redirectuje do Woo filtra Kováčske palivá. Solo karty idú na staging produkt, od 100 kg na tento konfigurátor.</p>';
    vulcanus_render_document('Vrecia s doručením', $note . $content);
    exit;
}

$page = 'paleta';
if (preg_match('#^/objednavka-paleta/hotovo#', $uri) || strpos($uri, '/hotovo') !== false) {
    $page = 'done';
} elseif (preg_match('#^/palivo/#', $uri)) {
    header('Location: https://staging.vulcanus.sk/?ukazka=obchod&rodina=kovacske-paliva', true, 302);
    exit;
}

$map = array(
    'paleta' => array('Paletová objednávka', 'paleta.php'),
    'done' => array('Objednávka', 'hotovo.php'),
);
list($title, $file) = $map[$page];
$content = include __DIR__ . '/templates/' . $file;
vulcanus_render_document($title, $content);
