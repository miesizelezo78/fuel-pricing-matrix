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

function vulcanus_bulk_clamp_kg($fuel, $kg) {
    $bag = (int) $fuel['bagKg'];
    $min = 100;
    $max = 10000;
    $kg = (int) round((float) $kg);
    if ($kg < $min) {
        $kg = $min;
    }
    if ($kg > $max) {
        $kg = $max;
    }
    $bags = max((int) ($min / $bag), (int) round($kg / $bag));
    $out = $bags * $bag;
    if ($fuel['id'] === 'koks' && ($kg === 250 || $out === 250 || $out === 240 || $out === 260)) {
        $out = 200;
    }
    while ($out > $max || ($out % $bag) !== 0) {
        $out -= $bag;
    }
    if ($out < $min) {
        $out = (int) ceil($min / $bag) * $bag;
    }
    return $out;
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
        'vatIncluded' => true,
    );
}
