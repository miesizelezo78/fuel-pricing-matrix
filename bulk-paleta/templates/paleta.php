<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}
$catalog = vulcanus_bulk_catalog();
$fuel_id = isset($_GET['palivo']) && isset($catalog['fuels'][$_GET['palivo']]) ? $_GET['palivo'] : 'uhlie';
$kg = isset($_GET['kg']) ? (int) $_GET['kg'] : $catalog['fuels'][$fuel_id]['presetsKg'][0];
$quote = vulcanus_bulk_quote($fuel_id, $kg, 'pallet');
$order_url = defined('VULCANUS_BULK_STANDALONE') && VULCANUS_BULK_STANDALONE
    ? '/order'
    : rest_url('bulk-paleta/v1/order');
$done_url = vulcanus_url('objednavka-paleta/hotovo');
ob_start();
?>
<div
  class="vulcanus-config"
  data-vulcanus-bulk
  data-catalog="<?php echo vulcanus_e(json_encode($catalog, JSON_UNESCAPED_UNICODE)); ?>"
  data-fuel="<?php echo vulcanus_e($quote['fuelId']); ?>"
  data-initial-kg="<?php echo (int) $quote['kg']; ?>"
  data-order-url="<?php echo vulcanus_e($order_url); ?>"
  data-done-url="<?php echo vulcanus_e($done_url); ?>"
>
  <p class="eyebrow">Nie košík · záväzná objednávka</p>
  <h1>Paletový predaj od 100 kg</h1>
  <p class="lead">
    Rovnaký cenník ako v náhľade, ale tovar nejde do e-shopového košíka.
    Uhlie, antracit a koks viete dať do jednej objednávky — každé palivo
    má vlastnú kartu a vlastnú sadzbu z vlastných kíl. Súčet sa na zľavu
    nesčíta. Paleta je jednorazová, nevratná a v cene tovaru. Paletovú
    dopravu naceníme, alebo si tovar vyzdvihnete.
  </p>

  <form id="vulcanus-bulk-form" class="grid-2" style="margin-top:1.5rem">
    <div data-fuel-cards>
      <?php foreach ($catalog['fuels'] as $id => $item) : ?>
        <section class="card fuel-card" data-fuel-card="<?php echo vulcanus_e($id); ?>">
          <div class="fuel-card-head">
            <div>
              <p class="eyebrow"><?php echo (int) $item['bagKg']; ?> kg / vrece</p>
              <h2><?php echo vulcanus_e($item['name']); ?></h2>
            </div>
            <button type="button" class="btn btn-outline" data-fuel-toggle>
              Pridať od 100 kg
            </button>
          </div>
          <p class="muted" style="font-size:.9rem">
            Sadzba ide z kíl tohto paliva, nie zo súčtu objednávky. Plus a mínus
            pridávajú jedno vrece (<?php echo (int) $item['bagKg']; ?> kg).
          </p>
          <div class="chips" data-presets></div>
          <div class="stepper-row">
            <p class="muted" style="margin:0;font-size:.9rem">
              Vlastné množstvo po <?php echo (int) $item['bagKg']; ?> kg (1 vrece)
            </p>
            <div class="stepper">
              <button type="button" data-kg-minus aria-label="Menej o jedno vrece">−</button>
              <span data-kg-label>0 kg</span>
              <button type="button" data-kg-plus aria-label="Viac o jedno vrece">+</button>
            </div>
          </div>
          <?php if ($id === 'koks') : ?>
            <p class="muted" data-koks-hint style="font-size:.8rem;margin-top:.6rem">
              Koks je vo 20 kg vreciach, preto tu nie je tlačidlo 250 kg — nevyšlo
              by to na celé vrecia. Presety sú 200 kg (10 vriec) a 500 kg. Plusom
              idete 220, 240, 260 kg.
            </p>
          <?php endif; ?>
          <p class="muted fuel-empty" data-fuel-empty hidden>
            Toto palivo v objednávke nie je. Preset alebo plus pridá od 100 kg.
          </p>
          <table class="ladder">
            <thead>
              <tr><th>Zostava</th><th>Vrecia</th><th>€ / kg</th><th class="right">Tovar</th></tr>
            </thead>
            <tbody data-ladder></tbody>
          </table>
          <div class="meter">
            <div style="display:flex;justify-content:space-between;font-size:.9rem">
              <span data-meter-label>Paleta</span>
              <span data-meter-pct></span>
            </div>
            <div class="meter-bar"><div class="meter-fill" data-meter-fill></div></div>
            <p class="muted" style="font-size:.75rem;margin:.6rem 0 0" data-meter-note></p>
          </div>
          <div class="facts" style="margin-top:1rem">
            <div><dt class="muted">Vrecia</dt><dd data-fact-bags>—</dd></div>
            <div><dt class="muted">Cena tovaru</dt><dd data-fact-goods>—</dd></div>
          </div>
        </section>
      <?php endforeach; ?>

      <section class="card" style="margin-top:1rem">
        <h2>Údaje pre SuperFaktúru</h2>
        <p class="muted" style="font-size:.9rem">
          Polia kopírujú klienta na doklade: meno, adresa, IČO, DIČ, IČ DPH,
          e-mail, telefón.
        </p>
        <input type="hidden" name="lines" value="">
        <input type="hidden" name="fulfillment" value="pallet">
        <div class="radio">
          <label><input type="radio" name="buyerType" value="person" checked> Fyzická osoba</label>
          <label><input type="radio" name="buyerType" value="company"> Firma / živnosť</label>
        </div>
        <div class="fields">
          <label><span data-name-label>Meno a priezvisko</span> <input name="name" required></label>
          <div class="fields-2">
            <label>E-mail <input type="email" name="email" required></label>
            <label>Telefón <input name="phone" required></label>
          </div>
          <div data-company-fields class="hidden fields-3">
            <label>IČO <input name="ico"></label>
            <label>DIČ <input name="dic"></label>
            <label>IČ DPH <input name="icDph"></label>
          </div>
          <label>Ulica a číslo <input name="street" required></label>
          <div class="fields-city">
            <label>Mesto <input name="city" required></label>
            <label>PSČ <input name="zip" placeholder="000 00" required></label>
          </div>
          <label>Poznámka k vykládke / odberu <textarea name="note" rows="3" placeholder="Vysokozdvižný vozík, čas, vjazd…"></textarea></label>
        </div>
      </section>
    </div>

    <aside class="card live" aria-live="polite">
      <h2>Živý prepočet</h2>
      <p class="muted" data-live-empty>Pridajte aspoň jedno palivo od 100 kg. Každá karta ostáva zvlášť, tu pribudnú položky.</p>
      <ul class="live-lines" data-live-lines></ul>
      <dl>
        <div class="row"><dt>Tovar s DPH</dt><dd data-live-goods>0,00 €</dd></div>
        <div class="row"><dt>Odhad dopravy</dt><dd data-live-freight>0,00 €</dd></div>
      </dl>
      <p class="total" data-live-total>0,00 €</p>
      <p class="muted" style="font-size:.8rem">
        Spolu = položky tovaru + odhad dopravy z celkových kíl zásielky.
        100 kg antracitu a 100 kg koksu sú dve stovky, nie jedna 200 kg sadzba.
        Do SuperFaktúry ide najprv tovar.
      </p>
      <div class="radio">
        <label>
          <input type="radio" name="fulfillmentChoice" value="pickup">
          <span><strong>Prídem osobne</strong><span class="muted" style="display:block;font-size:.8rem">Bez paletovej prepravy</span></span>
        </label>
        <label>
          <input type="radio" name="fulfillmentChoice" value="pallet" checked>
          <span><strong>Pošlite paletou</strong><span class="muted" style="display:block;font-size:.8rem">Dopravu naceníme podľa adresy</span></span>
        </label>
      </div>
      <label class="binding">
        <input type="checkbox" name="binding">
        <span>Objednávam záväzne tento tovar. Rozumiem, že to nie je nákup v košíku, paletu treba vychystať a neprevzatie alebo zrušenie počas prípravy nesie náklady. Text pred ostrým spustením overte s právnikom.</span>
      </label>
      <p class="err hidden" data-form-error></p>
      <button class="submit" type="submit">Odoslať záväznú objednávku</button>
      <p class="muted" style="font-size:.75rem;margin-top:.8rem">
        Ostrý doklad ide cez SuperFaktúra API. Bez kľúčov ostane náhľad.
        <a href="<?php echo vulcanus_e(vulcanus_url('ako-to-predavame')); ?>">Dva režimy predaja</a>
      </p>
    </aside>
  </form>
</div>
<?php
return ob_get_clean();
