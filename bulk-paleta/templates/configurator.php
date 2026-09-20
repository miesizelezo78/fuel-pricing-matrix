<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}
$catalog = vulcanus_bulk_catalog();
$fuel_id = isset($_GET['palivo']) && isset($catalog['fuels'][$_GET['palivo']]) ? $_GET['palivo'] : 'uhlie';
$kg = isset($_GET['kg']) ? (int) $_GET['kg'] : $catalog['fuels'][$fuel_id]['presetsKg'][0];
$quote = vulcanus_bulk_quote($fuel_id, $kg, 'pallet');
$catalog_attr = htmlspecialchars(json_encode($catalog, JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8');
$order_url = htmlspecialchars($order_url, ENT_QUOTES, 'UTF-8');
$done_url = htmlspecialchars($done_url, ENT_QUOTES, 'UTF-8');
$asset_css = htmlspecialchars($asset_css, ENT_QUOTES, 'UTF-8');
$asset_js = htmlspecialchars($asset_js, ENT_QUOTES, 'UTF-8');
?>
<link rel="stylesheet" href="<?php echo $asset_css; ?>">
<div
  class="vulcanus-bulk"
  data-vulcanus-bulk
  data-catalog="<?php echo $catalog_attr; ?>"
  data-fuel="<?php echo htmlspecialchars($fuel_id, ENT_QUOTES, 'UTF-8'); ?>"
  data-kg="<?php echo (int) $quote['kg']; ?>"
  data-order-url="<?php echo $order_url; ?>"
  data-done-url="<?php echo $done_url; ?>"
>
  <p class="eyebrow">Nie košík · záväzná objednávka</p>
  <h1>Paletový predaj od 100 kg</h1>
  <p class="lead">
    Kliknite palivo a kilá — cena tovaru, €/kg, odhad dopravy a spolu sa prepočítajú hneď.
    Toto nie je Woo košík. Solo vrecia v e-shope sa nemenia.
  </p>
  <div class="vulcanus-bulk-grid">
    <div>
      <section class="vulcanus-card">
        <h2>Palivo</h2>
        <div class="vulcanus-fuel">
          <?php foreach ($catalog['fuels'] as $id => $fuel) : ?>
            <button type="button" data-fuel-btn="<?php echo htmlspecialchars($id, ENT_QUOTES, 'UTF-8'); ?>">
              <?php echo htmlspecialchars($fuel['shortName'], ENT_QUOTES, 'UTF-8'); ?>
            </button>
          <?php endforeach; ?>
        </div>
        <h2>Hmotnosť — kliknite kg</h2>
        <div class="vulcanus-kg" data-presets></div>
        <div class="vulcanus-stepper">
          <button type="button" data-kg-minus aria-label="Menej o 100 kg">−</button>
          <span data-kg-label><?php echo number_format($quote['kg'], 0, ',', ' '); ?> kg</span>
          <button type="button" data-kg-plus aria-label="Viac o 100 kg">+</button>
        </div>
        <p class="hint" style="color:#6b6258;font-size:.85rem">
          Koks nemá 250 kg (20 kg vrecia). Cena/kg ide z celkových kíl.
        </p>
      </section>
      <section class="vulcanus-card" style="margin-top:1rem">
        <h2>Údaje na doklad</h2>
        <form id="vulcanus-bulk-form">
          <input type="hidden" name="fuelId" value="<?php echo htmlspecialchars($fuel_id, ENT_QUOTES, 'UTF-8'); ?>">
          <input type="hidden" name="kg" value="<?php echo (int) $quote['kg']; ?>">
          <input type="hidden" name="fulfillment" value="pallet">
          <div class="vulcanus-radio">
            <label><input type="radio" name="buyerType" value="person" checked> Fyzická osoba</label>
            <label><input type="radio" name="buyerType" value="company"> Firma / živnosť</label>
          </div>
          <p class="muted" data-buyer-hint style="font-size:.8rem">
            Fyzická osoba: meno a priezvisko. IČO sa tu nezobrazuje.
          </p>
          <div class="vulcanus-fields">
            <label><span data-name-label>Meno a priezvisko</span> <input name="name" required autocomplete="name"></label>
            <label>E-mail <input type="email" name="email" required autocomplete="email"></label>
            <label>Telefón <input name="phone" required autocomplete="tel"></label>
            <div data-company-fields hidden>
              <label>IČO <input name="ico" autocomplete="off"></label>
              <label>DIČ <input name="dic" autocomplete="off"></label>
              <label>IČ DPH <input name="icDph" autocomplete="off"></label>
            </div>
            <label>Ulica a číslo <input name="street" required autocomplete="street-address"></label>
            <div class="fields-city">
              <label>Mesto <input name="city" required autocomplete="address-level2"></label>
              <label>PSČ <input name="zip" placeholder="000 00" required autocomplete="postal-code" inputmode="numeric" maxlength="6"></label>
            </div>
            <label>Poznámka <textarea name="note" rows="3"></textarea></label>
          </div>
          <p class="vulcanus-error" data-form-error hidden></p>
          <button class="vulcanus-submit" type="submit">Odoslať záväznú objednávku</button>
        </form>
      </section>
    </div>
    <aside class="vulcanus-card vulcanus-live" aria-live="polite">
      <h2>Živý prepočet</h2>
      <p data-live-fuel><?php echo htmlspecialchars($quote['fuelName'], ENT_QUOTES, 'UTF-8'); ?></p>
      <dl>
        <div class="row"><dt>€/kg (s DPH)</dt><dd data-live-perkg><?php echo number_format($quote['pricePerKg'], 2, ',', ' '); ?> €</dd></div>
        <div class="row"><dt>Tovar s DPH</dt><dd data-live-goods><?php echo number_format($quote['goods'], 2, ',', ' '); ?> €</dd></div>
        <div class="row"><dt>Odhad dopravy</dt><dd data-live-freight><?php echo number_format($quote['freight'], 2, ',', ' '); ?> €</dd></div>
        <div class="row"><dt>Spolu</dt><dd data-live-total-row><?php echo number_format($quote['total'], 2, ',', ' '); ?> €</dd></div>
      </dl>
      <p class="total" data-live-total><?php echo number_format($quote['total'], 2, ',', ' '); ?> €</p>
      <p class="hint">Spolu = tovar + odhad dopravy. Pri osobnom odbere je doprava 0 €. Do SuperFaktúry ide najprv tovar.</p>
      <div class="vulcanus-radio">
        <label><input type="radio" name="fulfillmentChoice" value="pallet" checked> Pošlite paletou (odhad dopravy)</label>
        <label><input type="radio" name="fulfillmentChoice" value="pickup"> Prídem osobne (doprava 0 €)</label>
      </div>
      <label style="display:flex;gap:.5rem;align-items:flex-start;font-size:.9rem">
        <input type="checkbox" name="binding" form="vulcanus-bulk-form">
        <span>Objednávam záväzne. Nie je to nákup v košíku. Text overte s právnikom.</span>
      </label>
    </aside>
  </div>
</div>
<script src="<?php echo $asset_js; ?>"></script>
