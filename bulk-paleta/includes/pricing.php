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

function vulcanus_bulk_euro_bags($fuel) {
    $catalog = vulcanus_bulk_catalog();
    $max = (int) ($catalog['euroPallet']['maxKg'] ?? 200);
    $bag = (int) $fuel['bagKg'];
    return $bag > 0 ? (int) ($max / $bag) : 0;
}

function vulcanus_bulk_packing($fuel, $kg) {
    $catalog = vulcanus_bulk_catalog();
    $euro = $catalog['euroPallet'] ?? array('widthCm' => 80, 'depthCm' => 120, 'maxKg' => 200);
    $big = $catalog['industrialPallet'] ?? array('widthCm' => 110, 'depthCm' => 120, 'altWidthCm' => 110, 'altDepthCm' => 110);
    $kg = (int) $kg;
    $bag = (int) $fuel['bagKg'];
    $bags = $bag > 0 && $kg > 0 ? $kg / $bag : 0;
    if ($kg <= (int) $euro['maxKg']) {
        $cap = vulcanus_bulk_euro_bags($fuel);
        return array(
            'kind' => 'euro',
            'title' => 'Paleta ' . $euro['widthCm'] . ' × ' . $euro['depthCm'] . ' cm',
            'fraction' => $bags . ' / ' . $cap,
            'fill' => $cap > 0 ? min(1, $bags / $cap) : 0,
            'bags' => $bags,
            'capBags' => $cap,
            'extraPallets' => 0,
            'note' => '100 kg a 200 kg idú na paletu ' . $euro['widthCm'] . ' × ' . $euro['depthCm'] . ' cm. Väčšie množstvo na paletu ' . $big['widthCm'] . ' × ' . $big['depthCm'] . ' cm, niekedy ' . $big['altWidthCm'] . ' × ' . $big['altDepthCm'] . ' cm. Paleta je jednorazová, nevratná a v cene tovaru.',
            'ladderLabel' => $euro['widthCm'] . ' × ' . $euro['depthCm'] . ' cm',
            'invoiceLabel' => 'paleta ' . $euro['widthCm'] . ' × ' . $euro['depthCm'] . ' cm, jednorazová, nevratná, v cene',
        );
    }
    $cap = (int) $fuel['palletBags'];
    $extra = $bags > 0 && $cap > 0 ? max(0, (int) ceil($bags / $cap) - 1) : 0;
    $size = $big['widthCm'] . ' × ' . $big['depthCm'] . ' cm';
    $alt = $big['altWidthCm'] . ' × ' . $big['altDepthCm'] . ' cm';
    if ($extra > 0) {
        return array(
            'kind' => 'industrial',
            'title' => (1 + $extra) . ' palety ' . $size,
            'fraction' => $bags . ' vriec',
            'fill' => 1,
            'bags' => $bags,
            'capBags' => $cap,
            'extraPallets' => $extra,
            'note' => 'Nad jednu tonu ide ďalšia paleta 110 × 120 cm (+' . $extra . '). Niekedy aj ' . $alt . '. Palety sú jednorazové, nevratné a v cene tovaru.',
            'ladderLabel' => '110 × 120 cm',
            'invoiceLabel' => 'paleta ' . $size . ', jednorazová, nevratná, v cene',
        );
    }
    return array(
        'kind' => 'industrial',
        'title' => 'Paleta ' . $size,
        'fraction' => $bags > 0 ? $bags . ' / ' . $cap : '0 / ' . $cap,
        'fill' => $cap > 0 ? min(1, $bags / $cap) : 0,
        'bags' => $bags,
        'capBags' => $cap,
        'extraPallets' => 0,
        'note' => 'Väčšie množstvá idú na paletu ' . $size . '. Niekedy aj ' . $alt . '. Jedna tona = ' . $cap . ' × ' . $bag . ' kg. Paleta je jednorazová, nevratná a v cene tovaru.',
        'ladderLabel' => $size,
        'invoiceLabel' => 'paleta ' . $size . ', jednorazová, nevratná, v cene',
    );
}

function vulcanus_bulk_shipment_packing($priced) {
    $kg = 0;
    $names = array();
    foreach ($priced as $line) {
        $kg += (int) $line['kg'];
        if (!empty($line['shortName'])) {
            $names[] = $line['shortName'];
        }
    }
    if ($kg <= 0) {
        return array('kind' => 'euro', 'count' => 0, 'size' => '80 × 120 cm', 'title' => '', 'note' => '');
    }
    if ($kg <= 200) {
        $size = '80 × 120 cm';
        $note = count($priced) > 1 && count($names) > 1
            ? implode(' a ', $names) . ' idú spolu na jednej palete ' . $size . '. Paleta je jednorazová, nevratná a v cene tovaru.'
            : 'Paleta ' . $size . '. Paleta je jednorazová, nevratná a v cene tovaru.';
        return array(
            'kind' => 'euro',
            'count' => 1,
            'size' => $size,
            'title' => '1 paleta ' . $size,
            'note' => $note,
        );
    }
    $count = max(1, (int) ceil($kg / 1000));
    $size = '110 × 120 cm';
    $word = $count === 1 ? 'paleta' : ($count <= 4 ? 'palety' : 'paliet');
    $disposable = $count === 1 ? 'Paleta je jednorazová, nevratná a v cene tovaru.' : 'Palety sú jednorazové, nevratné a v cene tovaru.';
    return array(
        'kind' => 'industrial',
        'count' => $count,
        'size' => $size,
        'title' => $count . ' ' . $word . ' ' . $size,
        'note' => $count > 1
            ? $count . ' ' . $word . ' ' . $size . '. ' . $disposable . ' Niekedy aj 110 × 110 cm.'
            : 'Paleta ' . $size . '. ' . $disposable . ' Niekedy aj 110 × 110 cm.',
    );
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
        'shipment' => vulcanus_bulk_shipment_packing($priced),
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
        'packing' => vulcanus_bulk_packing($fuel, $kg),
        'vatIncluded' => true,
    );
}
