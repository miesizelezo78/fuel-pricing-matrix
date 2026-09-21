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
  <h1>Kováčske palivá od 100 kg</h1>
  <p class="lead">
    Vrecia s doručením ostávajú v e-shope. Od 100 kg to nie je košík —
    uhlie, antracit a koks viete dať do jednej objednávky. Každé palivo
    má vlastnú kartu a vlastnú sadzbu z vlastných kíl. Súčet sa na zľavu
    nesčíta. Paleta je jednorazová, nevratná a v cene tovaru. Paletovú
    dopravu naceníme, alebo si tovar vyzdvihnete.
  </p>

  <form id="vulcanus-bulk-form" class="grid-2" style="margin-top:1.5rem">
    <div data-fuel-cards data-work-stack>
      <?php foreach ($catalog['fuels'] as $id => $item) : ?>
        <section class="card fuel-card" data-fuel-card="<?php echo vulcanus_e($id); ?>" data-work-window>
          <div class="fuel-card-head">
            <div>
              <p class="eyebrow">Od 100 kg · <?php echo (int) $item['bagKg']; ?> kg vrece</p>
              <h2><?php echo vulcanus_e($item['name']); ?></h2>
            </div>
            <button type="button" class="btn btn-outline" data-fuel-toggle>
              Pridať od 100 kg
            </button>
          </div>
          <p class="muted">
            Sadzba ide z kíl tohto paliva, nie zo súčtu objednávky. Plus a mínus
            pridávajú jedno vrece (<?php echo (int) $item['bagKg']; ?> kg).
          </p>
          <div class="chips" data-presets></div>
          <div class="stepper-row">
            <p class="muted" style="margin:0">
              Vlastné množstvo po <?php echo (int) $item['bagKg']; ?> kg (1 vrece)
            </p>
            <div class="stepper">
              <button type="button" data-kg-minus aria-label="Menej o jedno vrece">−</button>
              <span data-kg-label>0 kg</span>
              <button type="button" data-kg-plus aria-label="Viac o jedno vrece">+</button>
            </div>
          </div>
          <?php if ($id === 'koks') : ?>
            <p class="muted" data-koks-hint style="margin-top:.6rem">
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
            <div class="meter-head">
              <span data-meter-label>Paleta</span>
              <span data-meter-pct></span>
            </div>
            <div class="meter-bar"><div class="meter-fill" data-meter-fill></div></div>
            <p class="muted meter-note" data-meter-note></p>
          </div>
          <div class="facts" style="margin-top:1rem">
            <div><dt class="muted">Vrecia</dt><dd data-fact-bags>—</dd></div>
            <div><dt class="muted">Cena tovaru</dt><dd data-fact-goods>—</dd></div>
          </div>
        </section>
      <?php endforeach; ?>

      <section class="card" data-invoice-card data-work-window style="margin-top:1rem">
        <h2>Údaje na predfaktúru</h2>
        <p class="muted">
          Meno, adresa, e-mail, telefón. Firma doplní IČO. Ak ste platca DPH,
          doplňte IČ DPH — v súhrne sa rozpíše daň. Neplatičom stačí IČO.
        </p>
        <input type="hidden" name="lines" value="">
        <input type="hidden" name="fulfillment" value="pallet">
        <div class="radio">
          <label><input type="radio" name="buyerType" value="person" checked> Fyzická osoba</label>
          <label><input type="radio" name="buyerType" value="company"> Firma / živnosť</label>
        </div>
        <p class="muted" data-buyer-hint style="margin:-.35rem 0 .7rem">
          Fyzická osoba: meno a priezvisko. Ceny v súhrne sú konečné, vrátane DPH, bez rozpisu dane.
        </p>
        <div class="fields">
          <label><span data-name-label>Meno a priezvisko</span> <input name="name" required autocomplete="name"></label>
          <div class="fields-2">
            <label>E-mail <input type="email" name="email" required autocomplete="email"></label>
            <label>Telefón <input name="phone" required autocomplete="tel"></label>
          </div>
          <div data-company-fields class="hidden fields-3">
            <label>IČO <input name="ico" autocomplete="off"></label>
            <label>DIČ <input name="dic" autocomplete="off"></label>
            <label>IČ DPH <span class="field-hint">(len platca DPH)</span> <input name="icDph" placeholder="SK…" autocomplete="off"></label>
          </div>
          <label>Ulica a číslo <input name="street" required autocomplete="street-address"></label>
          <div class="fields-city">
            <label>Mesto <input name="city" required autocomplete="address-level2"></label>
            <label>PSČ <input name="zip" placeholder="000 00" required autocomplete="postal-code" inputmode="numeric" maxlength="6"></label>
          </div>
          <label>Poznámka k vykládke / odberu <textarea name="note" rows="3" placeholder="Vysokozdvižný vozík, čas, vjazd…"></textarea></label>
        </div>
      </section>
    </div>

    <div class="live-track">
    <aside class="card live">
    <div class="live-body" data-live-panel aria-live="polite">
      <h2>Súhrn objednávky</h2>
      <p class="muted" data-live-empty>Pridajte aspoň jedno palivo od 100 kg. Každá karta ostáva zvlášť, tu pribudnú položky.</p>
      <ul class="live-lines" data-live-lines></ul>
      <dl>
        <div class="row" data-vat-breakdown hidden>
          <dt>Základ dane</dt><dd data-live-net>0,00 €</dd>
        </div>
        <div class="row" data-vat-breakdown hidden>
          <dt data-live-vat-label>DPH 23 %</dt><dd data-live-vat>0,00 €</dd>
        </div>
        <div class="row"><dt data-live-goods-label>Tovar</dt><dd data-live-goods>0,00 €</dd></div>
        <div class="row"><dt>Odhad dopravy</dt><dd data-live-freight>0,00 €</dd></div>
      </dl>
      <p class="total-kicker">Spolu k úhrade</p>
      <p class="total" data-live-total>0,00 €</p>
      <p class="muted" data-live-vat-note>
        Ceny sú konečné, vrátane DPH. Zľava za množstvo sa na palivá nesčítava.
        Do predfaktúry ide najprv tovar.
      </p>
      <div class="radio">
        <label>
          <input type="radio" name="fulfillmentChoice" value="pickup">
          <span><strong>Prídem osobne</strong><span class="muted radio-sub">Bez paletovej prepravy</span></span>
        </label>
        <label>
          <input type="radio" name="fulfillmentChoice" value="pallet" checked>
          <span><strong>Pošlite paletou</strong><span class="muted radio-sub">Dopravu naceníme podľa adresy</span></span>
        </label>
      </div>
      <label class="binding">
        <input type="checkbox" name="binding">
        <span>Objednávam záväzne tento tovar. Rozumiem, že to nie je nákup v košíku, paletu treba vychystať a neprevzatie alebo zrušenie počas prípravy nesie náklady. Text pred ostrým spustením overte s právnikom.</span>
      </label>
      <p class="err hidden" data-form-error></p>
      <button class="submit" type="submit">Odoslať záväznú objednávku</button>
      <p class="muted legal-note">
        Ostrý doklad ide cez SuperFaktúra API. Bez kľúčov ostane náhľad.
        <a href="<?php echo vulcanus_e(vulcanus_fuels_hub_url()); ?>">Sprievodca palivami</a>
        ·
        <a href="<?php echo vulcanus_e(vulcanus_fuels_shop_url()); ?>">Vrecia s doručením</a>
      </p>
    </div>
    </aside>
    </div>
  </form>
</div>
<?php
return ob_get_clean();
