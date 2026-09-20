<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}

function vulcanus_bulk_validate_order($input) {
    $errors = array();
    if (empty($input['binding'])) {
        $errors['binding'] = 'Potvrďte, že ide o záväznú objednávku.';
    }
    $name = trim((string) ($input['name'] ?? ''));
    if (strlen($name) < 3) {
        $errors['name'] = 'Zadajte meno / názov firmy.';
    }
    $email = trim((string) ($input['email'] ?? ''));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Zadajte platný e-mail.';
    }
    $phone = preg_replace('/\s+/', '', (string) ($input['phone'] ?? ''));
    if (strlen($phone) < 9) {
        $errors['phone'] = 'Zadajte telefón.';
    }
    if (strlen(trim((string) ($input['street'] ?? ''))) < 4) {
        $errors['street'] = 'Zadajte ulicu a číslo.';
    }
    if (strlen(trim((string) ($input['city'] ?? ''))) < 2) {
        $errors['city'] = 'Zadajte mesto.';
    }
    $zip = trim((string) ($input['zip'] ?? ''));
    if (!preg_match('/^\d{3}\s?\d{2}$/', $zip)) {
        $errors['zip'] = 'PSČ v tvare 000 00.';
    }
    if (($input['buyerType'] ?? 'person') === 'company') {
        $ico = preg_replace('/\s+/', '', (string) ($input['ico'] ?? ''));
        if (strlen($ico) < 6) {
            $errors['ico'] = 'Zadajte IČO.';
        }
    }
    $lines = vulcanus_bulk_read_lines($input);
    $quote = vulcanus_bulk_quote_order(
        $lines,
        (string) ($input['fulfillment'] ?? 'pallet')
    );
    if (empty($quote['ok'])) {
        $errors['fuelId'] = $quote['error'] ?? 'Neznáme palivo.';
    }
    return array($errors, $quote);
}

function vulcanus_bulk_create_order($input) {
    list($errors, $quote) = vulcanus_bulk_validate_order($input);
    if ($errors) {
        $first = reset($errors);
        return array('ok' => false, 'error' => $first, 'errors' => $errors);
    }
    $order_id = 'PAL-' . substr((string) round(microtime(true) * 1000), -8);
    $email = getenv('SUPERFAKTURA_EMAIL') ?: (defined('SUPERFAKTURA_EMAIL') ? SUPERFAKTURA_EMAIL : '');
    $api_key = getenv('SUPERFAKTURA_API_KEY') ?: (defined('SUPERFAKTURA_API_KEY') ? SUPERFAKTURA_API_KEY : '');
    $mocked = ($email === '' || $api_key === '');

    $payload = array(
        'orderId' => $order_id,
        'quote' => $quote,
        'client' => array(
            'name' => trim((string) $input['name']),
            'email' => trim((string) $input['email']),
            'phone' => trim((string) $input['phone']),
            'street' => trim((string) $input['street']),
            'city' => trim((string) $input['city']),
            'zip' => trim((string) $input['zip']),
            'ico' => preg_replace('/\s+/', '', (string) ($input['ico'] ?? '')),
            'dic' => preg_replace('/\s+/', '', (string) ($input['dic'] ?? '')),
            'icDph' => preg_replace('/\s+/', '', (string) ($input['icDph'] ?? '')),
            'note' => trim((string) ($input['note'] ?? '')),
            'buyerType' => ($input['buyerType'] ?? 'person') === 'company' ? 'company' : 'person',
        ),
        'mocked' => $mocked,
        'createdAt' => gmdate('c'),
    );

    $dir = (defined('WP_CONTENT_DIR') ? WP_CONTENT_DIR : sys_get_temp_dir()) . '/vulcanus-bulk-orders';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    @file_put_contents($dir . '/' . $order_id . '.json', json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    if (!$mocked) {
        $sf = vulcanus_bulk_push_superfaktura($email, $api_key, $payload);
        if (empty($sf['ok'])) {
            return array('ok' => false, 'error' => $sf['error'] ?? 'SuperFaktúra zlyhala.');
        }
        $payload['documentId'] = $sf['documentId'] ?? null;
        $payload['mocked'] = false;
    }

    return array(
        'ok' => true,
        'orderId' => $order_id,
        'mocked' => $payload['mocked'],
        'goods' => $quote['goods'],
        'freight' => $quote['freight'],
        'total' => $quote['total'],
        'kg' => $quote['kg'],
        'bags' => $quote['bags'],
        'fuelName' => $quote['fuelName'],
        'fulfillment' => $quote['fulfillment'],
        'lines' => $quote['lines'],
        'message' => $payload['mocked']
            ? 'Objednávka je uložená ako náhľad. Doplňte kľúče SuperFaktúry pre ostrý doklad.'
            : 'Objednávka odišla do SuperFaktúry.',
    );
}

function vulcanus_bulk_push_superfaktura($email, $api_key, $payload) {
    $quote = $payload['quote'];
    $client = $payload['client'];
    $company = getenv('SUPERFAKTURA_COMPANY_ID') ?: '';
    $base = rtrim(getenv('SUPERFAKTURA_BASE_URL') ?: 'https://moja.superfaktura.sk', '/');
    $vat = (int) vulcanus_bulk_catalog()['vatPercent'];
    $fulfillment_label = $quote['fulfillment'] === 'pickup'
        ? 'Osobný odber. Paletovú dopravu neúčtujeme.'
        : 'Paletová preprava. Dopravu naceníme zvlášť a doplníme do dokladu.';
    $items = array();
    foreach ($quote['lines'] as $line) {
        $net = vulcanus_bulk_round($line['pricePerKg'] / (1 + $vat / 100));
        $items[] = array(
            'name' => $line['fuelName'],
            'description' => $line['bags'] . ' × ' . $line['bagKg'] . ' kg · ' . $line['tierLabel'],
            'quantity' => $line['kg'],
            'unit' => 'kg',
            'unit_price' => $net,
            'tax' => $vat,
        );
    }
    $body = array(
        'Invoice' => array(
            'name' => 'Záväzná objednávka ' . $quote['fuelName'],
            'type' => 'order',
            'order_no' => $payload['orderId'],
            'invoice_currency' => 'EUR',
            'header_comment' => 'Záväzná paletová objednávka, nie e-shopový košík. Každé palivo má vlastnú sadzbu z vlastných kíl. ' . (!empty($quote['shipment']['note']) ? $quote['shipment']['note'] . ' ' : '') . $fulfillment_label,
        ),
        'InvoiceItem' => $items,
        'Client' => array(
            'name' => $client['name'],
            'email' => $client['email'],
            'phone' => $client['phone'],
            'address' => $client['street'],
            'city' => $client['city'],
            'zip' => $client['zip'],
            'country_id' => 191,
            'ico' => $client['ico'] ?: null,
            'dic' => $client['dic'] ?: null,
            'ic_dph' => $client['icDph'] ?: null,
            'update_addressbook' => 1,
        ),
    );
    $auth = 'SFAPI email=' . rawurlencode($email) . '&apikey=' . rawurlencode($api_key) . '&company_id=' . rawurlencode($company);
    $endpoint = $base . '/invoices/create';
    $post = http_build_query(array('data' => json_encode($body)));
    if (function_exists('wp_remote_post')) {
        $response = wp_remote_post(
            $endpoint,
            array(
                'headers' => array(
                    'Content-Type' => 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization' => $auth,
                ),
                'body' => array('data' => wp_json_encode($body)),
                'timeout' => 20,
            )
        );
        if (is_wp_error($response)) {
            return array('ok' => false, 'error' => $response->get_error_message());
        }
        $raw = wp_remote_retrieve_body($response);
    } else {
        $ctx = stream_context_create(array(
            'http' => array(
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded;charset=UTF-8\r\nAuthorization: $auth\r\n",
                'content' => $post,
                'timeout' => 20,
            ),
        ));
        $raw = @file_get_contents($endpoint, false, $ctx);
        if ($raw === false) {
            return array('ok' => false, 'error' => 'SuperFaktúra neodpovedala.');
        }
    }
    $json = json_decode($raw, true);
    if (!empty($json['error'])) {
        return array('ok' => false, 'error' => $json['error_message'] ?? 'SuperFaktúra vrátila chybu.');
    }
    return array(
        'ok' => true,
        'documentId' => $json['data']['Invoice']['id'] ?? null,
    );
}
