<?php
/**
 * Catalog + live quote. One JSON file is the source of truth.
 */
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}

function vulcanus_bulk_catalog_path() {
    return dirname(__FILE__) . '/catalog.json';
}

function vulcanus_bulk_catalog() {
    static $data = null;
    if ($data !== null) {
        return $data;
    }
    $raw = file_get_contents(vulcanus_bulk_catalog_path());
    $data = json_decode($raw, true);
    return $data;
}

function vulcanus_bulk_fuel_ids() {
    return array('uhlie', 'antracit', 'koks');
}

function vulcanus_bulk_products($channel = null) {
    $catalog = vulcanus_bulk_catalog();
    $products = isset($catalog['products']) ? $catalog['products'] : array();
    if ($channel === null) {
        return $products;
    }
    return array_values(array_filter($products, function ($product) use ($channel) {
        return ($product['channel'] ?? '') === $channel;
    }));
}

function vulcanus_bulk_product_by_slug($slug) {
    foreach (vulcanus_bulk_products() as $product) {
        if ($product['slug'] === $slug) {
            return $product;
        }
    }
    return null;
}

function vulcanus_bulk_pallet_kg($fuel) {
    return (int) $fuel['bagKg'] * (int) $fuel['palletBags'];
}

function vulcanus_bulk_pallet_fill($fuel, $kg) {
    $full = vulcanus_bulk_pallet_kg($fuel);
    return $full > 0 ? ($kg / $full) : 0;
}

function vulcanus_bulk_money($value) {
    return number_format((float) $value, 2, ',', ' ') . ' €';
}

function vulcanus_bulk_perkg($value) {
    return vulcanus_bulk_money($value) . '/kg';
}

function vulcanus_bulk_fuel($id) {
    $catalog = vulcanus_bulk_catalog();
    if (!isset($catalog['fuels'][$id])) {
        return null;
    }
    return $catalog['fuels'][$id];
}

function vulcanus_bulk_round($value) {
    return round((float) $value, 2);
}

function vulcanus_bulk_tier($fuel, $kg) {
    $current = $fuel['tiers'][0];
    foreach ($fuel['tiers'] as $tier) {
        if ($kg >= (int) $tier['minKg']) {
            $current = $tier;
        }
    }
    return $current;
}

function vulcanus_bulk_freight($kg, $fulfillment) {
    if ($fulfillment === 'pickup' || $kg <= 0) {
        return 0.0;
    }
    $catalog = vulcanus_bulk_catalog();
    $pallets = max(1, (int) ceil($kg / 1000));
    $rate = 89.0;
    foreach ($catalog['freightPerPalletEur'] as $row) {
        if ($row['belowKg'] === null || $kg < (int) $row['belowKg']) {
            $rate = (float) $row['eur'];
            break;
        }
    }
    return vulcanus_bulk_round($rate * $pallets);
}

function vulcanus_bulk_clamp_kg($fuel, $kg, $allow_zero = false) {
    $bag = (int) $fuel['bagKg'];
    $min = 100;
    $max = 10000;
    $kg = (int) round((float) $kg);
    if ($allow_zero && $kg <= 0) {
        return 0;
    }
    if ($kg < $min) {
        $kg = $min;
    }
    if ($kg > $max) {
        $kg = $max;
    }
    $bags = max((int) ceil($min / $bag), (int) round($kg / $bag));
    $out = $bags * $bag;
    while ($out > $max) {
        $out -= $bag;
    }
    if ($out < $min) {
        $out = (int) ceil($min / $bag) * $bag;
    }
    return $out;
}

function vulcanus_bulk_savings($fuel, $kg, $price_per_kg) {
    $first = (float) $fuel['tiers'][0]['pricePerKg'];
    return vulcanus_bulk_round(($first - (float) $price_per_kg) * $kg);
}

function vulcanus_bulk_read_lines($input) {
    $lines = array();
    $raw = $input['lines'] ?? null;
    if (is_string($raw)) {
        $decoded = json_decode($raw, true);
        $raw = is_array($decoded) ? $decoded : null;
    }
    if (is_array($raw)) {
        foreach ($raw as $line) {
            if (!is_array($line)) {
                continue;
            }
            $id = (string) ($line['fuelId'] ?? '');
            $kg = (int) ($line['kg'] ?? 0);
            if ($id !== '' && $kg > 0) {
                $lines[] = array('fuelId' => $id, 'kg' => $kg);
            }
        }
    } elseif (!empty($input['fuelId'])) {
        $lines[] = array(
            'fuelId' => (string) $input['fuelId'],
            'kg' => (int) ($input['kg'] ?? 0),
        );
    }
    return $lines;
}

function vulcanus_bulk_quote_order($lines, $fulfillment = 'pallet') {
    $fulfillment = $fulfillment === 'pickup' ? 'pickup' : 'pallet';
    $priced = array();
    $goods = 0.0;
    $kg = 0;
    $bags = 0;
    $savings = 0.0;
    if (!is_array($lines) || !$lines) {
        return array('ok' => false, 'error' => 'Vyberte aspoň jedno palivo od 100 kg.');
    }
    foreach ($lines as $line) {
        $q = vulcanus_bulk_quote($line['fuelId'], $line['kg'], 'pickup');
        if (empty($q['ok'])) {
            return $q;
        }
        $fuel = vulcanus_bulk_fuel($q['fuelId']);
        $save = vulcanus_bulk_savings($fuel, $q['kg'], $q['pricePerKg']);
        $q['savings'] = $save;
        $q['freight'] = 0;
        $q['total'] = $q['goods'];
        $priced[] = $q;
        $goods += $q['goods'];
        $kg += $q['kg'];
        $bags += $q['bags'];
        $savings += $save;
    }
    $goods = vulcanus_bulk_round($goods);
    $savings = vulcanus_bulk_round($savings);
    $freight = vulcanus_bulk_freight($kg, $fulfillment);
    $names = array();
    foreach ($priced as $row) {
        $names[] = $row['fuelName'];
    }
    return array(
        'ok' => true,
        'lines' => $priced,
        'kg' => $kg,
        'bags' => $bags,
        'goods' => $goods,
        'savings' => $savings,
        'freight' => $freight,
        'freightIsEstimate' => $fulfillment === 'pallet',
        'total' => vulcanus_bulk_round($goods + $freight),
        'fulfillment' => $fulfillment,
        'fuelName' => implode(' + ', $names),
        'vatIncluded' => true,
    );
}

function vulcanus_bulk_quote($fuel_id, $kg, $fulfillment = 'pallet') {
    $fuel = vulcanus_bulk_fuel($fuel_id);
    if (!$fuel) {
        return array('ok' => false, 'error' => 'Neznáme palivo.');
    }
    $fulfillment = $fulfillment === 'pickup' ? 'pickup' : 'pallet';
    $kg = vulcanus_bulk_clamp_kg($fuel, $kg);
    $tier = vulcanus_bulk_tier($fuel, $kg);
    $price = (float) $tier['pricePerKg'];
    $goods = vulcanus_bulk_round($kg * $price);
    $freight = vulcanus_bulk_freight($kg, $fulfillment);
    $bags = (int) ($kg / (int) $fuel['bagKg']);
    return array(
        'ok' => true,
        'fuelId' => $fuel['id'],
        'fuelName' => $fuel['name'],
        'shortName' => $fuel['shortName'],
        'bagKg' => (int) $fuel['bagKg'],
        'kg' => $kg,
        'bags' => $bags,
        'tierLabel' => $tier['label'],
        'pricePerKg' => $price,
        'goods' => $goods,
        'freight' => $freight,
        'freightIsEstimate' => $fulfillment === 'pallet',
        'total' => vulcanus_bulk_round($goods + $freight),
        'fulfillment' => $fulfillment,
        'presetsKg' => $fuel['presetsKg'],
        'savings' => vulcanus_bulk_savings($fuel, $kg, $price),
        'vatIncluded' => true,
    );
}
