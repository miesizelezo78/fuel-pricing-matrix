<?php
if (!defined('ABSPATH') && !defined('VULCANUS_BULK_STANDALONE')) {
    exit;
}
ob_start();
?>
<article class="article">
  <header>
    <p class="eyebrow">Model katalógu</p>
    <h1>Kde sa predaj láme</h1>
    <p class="lead">
      Solo vrece je e-shopový produkt. Od 100 kg to e-shopový produkt
      nie je — je to tovar na objednávku. Rovnaký vzhľad dlaždíc, iné
      tlačidlo, iná podstránka, iné pravidlá.
    </p>
  </header>

  <section class="card">
    <h2>Dve hranice, nie plynulý košík</h2>
    <ol>
      <li><strong>Kuriér (jedna zásielka).</strong> Balíme jednu zásielku: 3 vrecia uhlia alebo antracitu, alebo 4 vrecia koksu. Doprava je v cene vreca.</li>
      <li><strong>Režim predaja (od 100 kg).</strong> Od stovky kíl to nie je položka e-shopu. Je to tovar na objednávku: konfigurátor, formulár, doklad v SuperFaktúre. Preto nie „do košíka“, ale „k objednávke“.</li>
    </ol>
  </section>

  <section>
    <h2>Čo je v jednom vreci</h2>
    <ul>
      <li>Kováčske uhlie — 25 kg</li>
      <li>Kováčsky antracit — 25 kg</li>
      <li>Kováčsky koks — 20 kg</li>
    </ul>
    <p class="muted">Na paletu 110 × 120 cm ide 40 vriec uhlia alebo antracitu, alebo 50 vriec koksu. Obidve cesty dajú jednu tonu.</p>
  </section>

  <section>
    <h2>Solo vrecia</h2>
    <p class="muted">Tri samostatné položky: hobby kováči, nožiari, vzorky. Cena na dlaždici už zahŕňa balné aj doručenie SDS. Woo košík ostáva len pre tieto vrecia — tieto tri podstránky Woo nie sú.</p>
  </section>

  <section>
    <h2>Od 100 kg: záväzná objednávka</h2>
    <p class="muted">Dlaždica „od 100 kg“ nie je produkt. Klik ide na podstránku Paleta s konfigurátorom. Cenník 100 / 250 / 500 / 1 000 kg (koks 200 namiesto 250). Tlačidlo je „k objednávke“.</p>
  </section>

  <section class="card">
    <h2>Čo na to WooCommerce</h2>
    <p class="muted">Woo ostáva pre tri solo vrecia. Paleta, Palivá aj Ako to predávame sú samostatné podstránky tohto modulu — nie Woo produkty.</p>
  </section>
</article>
<?php
return ob_get_clean();
