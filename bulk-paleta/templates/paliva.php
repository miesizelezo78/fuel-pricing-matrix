<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}
ob_start();
?>
<div class="hero">
  <div>
    <p class="eyebrow">Do vyhne, nie do kotla</p>
    <h1>Uhlie, koks a antracit tak, ako sa skutočne balia.</h1>
    <p class="lead">
      Solo vrece ide kuriérom, s dopravou v cene, ako e-shop. Od 100 kg
      je to paletová objednávka — iný režim, iné pravidlá, dopravu
      naceníme alebo si tovar vyzdvihnete.
    </p>
    <div class="actions">
      <a class="btn btn-primary" href="<?php echo vulcanus_e(vulcanus_url('objednavka-paleta')); ?>">Paletová objednávka</a>
      <a class="btn btn-outline" href="<?php echo vulcanus_e(vulcanus_url('ako-to-predavame')); ?>">Prečo dva režimy</a>
    </div>
  </div>
  <dl class="stats">
    <div class="stat"><dt>Vrece uhlia / antracitu</dt><dd>25 kg</dd></div>
    <div class="stat"><dt>Vrece koksu</dt><dd>20 kg</dd></div>
    <div class="stat"><dt>Europaleta</dt><dd>80 × 120 cm</dd></div>
    <div class="stat"><dt>1 tona</dt><dd>110 × 120 cm</dd></div>
  </dl>
</div>

<section class="block">
  <div class="block-head">
    <div>
      <p class="eyebrow">Hobby · vzorky · kuriér</p>
      <h2>Solo vrecia s doručením</h2>
    </div>
    <p class="muted" style="max-width:24rem;font-size:.9rem">
      Cena už obsahuje balné aj dopravu SDS. Jedna zásielka: 3 vrecia uhlia alebo antracitu, 4 vrecia koksu.
    </p>
  </div>
  <div class="tiles">
    <?php foreach (vulcanus_bulk_products('solo') as $product) :
        $fuel = vulcanus_bulk_fuel($product['fuelId']);
        ?>
      <a class="tile" href="<?php echo vulcanus_e(vulcanus_url('palivo/' . $product['slug'])); ?>">
        <div class="tile-top">
          <span class="badge">E-shop · kuriér</span>
          <span class="note"><?php echo (int) $fuel['bagKg']; ?> kg / vrece</span>
        </div>
        <div class="bag-wrap"><?php echo vulcanus_bag_svg($fuel, $fuel['bagKg']); ?></div>
        <h3><?php echo vulcanus_e($product['name']); ?></h3>
        <p><?php echo vulcanus_e($product['lead']); ?></p>
        <div class="tile-foot">
          <div>
            <div class="price"><?php echo vulcanus_e(vulcanus_bulk_money($fuel['soloPrice'])); ?></div>
            <div class="note">s doručením</div>
          </div>
          <span class="cta">Detail →</span>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>

<section class="block">
  <div class="block-head">
    <div>
      <p class="eyebrow">Europaleta, potom 110 × 120 cm</p>
      <h2>Na objednávku od 100 kg</h2>
    </div>
    <p class="muted" style="max-width:24rem;font-size:.9rem">
      Dlaždica vyzerá ako v e-shope, ale to nie je produkt do košíka. Klik ide na konfigurátor.
    </p>
  </div>
  <div class="tiles">
    <?php foreach (vulcanus_bulk_products('bulk') as $product) :
        $fuel = vulcanus_bulk_fuel($product['fuelId']);
        $pallet = vulcanus_bulk_quote($fuel['id'], vulcanus_bulk_pallet_kg($fuel), 'pallet');
        ?>
      <a class="tile" href="<?php echo vulcanus_e(vulcanus_url('objednavka-paleta?palivo=' . $fuel['id'])); ?>">
        <div class="tile-top">
          <span class="badge badge-order">Na objednávku</span>
          <span class="note"><?php echo (int) $fuel['bagKg']; ?> kg / vrece</span>
        </div>
        <div class="bag-wrap"><?php echo vulcanus_bag_svg($fuel, $fuel['bagKg']); ?></div>
        <h3><?php echo vulcanus_e($product['name']); ?></h3>
        <p><?php echo vulcanus_e($product['lead']); ?></p>
        <div class="tile-foot">
          <div>
            <div class="price"><?php echo vulcanus_e(vulcanus_bulk_perkg($pallet['pricePerKg'])); ?></div>
            <div class="note">od 100 kg · paleta <?php echo vulcanus_e(vulcanus_bulk_perkg($pallet['pricePerKg'])); ?></div>
          </div>
          <span class="cta">K objednávke →</span>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>
<?php
return ob_get_clean();
