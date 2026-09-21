<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}
$slug = isset($palivo_slug) ? $palivo_slug : '';
$product = vulcanus_bulk_product_by_slug($slug);
if (!$product) {
    return '<p>Produkt sa nenašiel. <a href="' . vulcanus_e(vulcanus_url('paliva')) . '">Späť na Palivá</a></p>';
}
$fuel = vulcanus_bulk_fuel($product['fuelId']);
$pallet = vulcanus_bulk_quote($fuel['id'], vulcanus_bulk_pallet_kg($fuel), 'pallet');
ob_start();
?>
<div class="grid-2">
  <div>
    <p class="eyebrow"><?php echo vulcanus_e($product['eyebrow']); ?></p>
    <h1><?php echo vulcanus_e($product['name']); ?></h1>
    <p>
      <span class="badge"><?php echo (int) $fuel['bagKg']; ?> kg vrece</span>
      <?php if ($product['channel'] === 'solo') : ?>
        <span class="badge">Doprava v cene</span>
        <span class="badge">1 zásielka · max. <?php echo (int) $fuel['soloMaxBags']; ?> vrecia</span>
      <?php else : ?>
        <span class="badge badge-order">Na objednávku</span>
      <?php endif; ?>
    </p>
    <div class="bag-wrap" style="width:12rem;height:15rem;margin:1.5rem auto 0"><?php echo vulcanus_bag_svg($fuel, $fuel['bagKg']); ?></div>
    <p class="muted"><?php echo vulcanus_e($fuel['summary'] . ' ' . $product['lead']); ?></p>
    <a class="tile invite" href="<?php echo vulcanus_e(vulcanus_url('objednavka-paleta?palivo=' . $fuel['id'])); ?>">
      <div class="bag-wrap"><?php echo vulcanus_bag_svg($fuel, $fuel['bagKg']); ?></div>
      <div>
        <span class="badge badge-order">Na objednávku</span>
        <h3 style="margin:.4rem 0"><?php echo vulcanus_e($fuel['shortName']); ?> od 100 kg</h3>
        <p>Toto vrece s kuriérom je e-shop. Od 100 kg je to tovar na objednávku — konfigurátor, paleta, nie košík.</p>
        <p class="cta"><?php echo vulcanus_e(vulcanus_bulk_perkg($pallet['pricePerKg'])); ?> na plnej palete · K objednávke →</p>
      </div>
    </a>
  </div>
  <div class="card">
    <?php if ($product['channel'] === 'solo') : ?>
      <p>Toto je e-shopové vrece. Cena <strong><?php echo vulcanus_e(vulcanus_bulk_money($fuel['soloPrice'])); ?></strong> už obsahuje balné aj doručenie kuriérom SDS. Jedna zásielka najviac <strong><?php echo (int) $fuel['soloMaxBags']; ?> vrecia <?php echo vulcanus_e($fuel['adjective']); ?></strong>.</p>
      <p class="muted">Solo nákup ostáva v existujúcom Woo košíku. Táto podstránka Woo nenahrádza — ukazuje tovar a posiela od 100 kg na Paletu.</p>
      <p><a class="btn btn-primary" href="<?php echo vulcanus_e(vulcanus_url('objednavka-paleta?palivo=' . $fuel['id'])); ?>">Od 100 kg k objednávke</a></p>
    <?php else : ?>
      <p>Toto nie je produkt do košíka.</p>
      <p><a class="btn btn-primary" href="<?php echo vulcanus_e(vulcanus_url('objednavka-paleta?palivo=' . $fuel['id'])); ?>">Otvoriť konfigurátor</a></p>
    <?php endif; ?>
  </div>
</div>
<?php
return ob_get_clean();
