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
      tlačidlo, iná podstránka, iné pravidlá. Text záväzku pred ostrým
      spustením overte s právnikom.
    </p>
  </header>

  <section class="card">
    <h2>Dve hranice, nie plynulý košík</h2>
    <ol>
      <li>
        <strong>Kuriér (jedna zásielka).</strong>
        Balíme jednu zásielku: 3 vrecia uhlia alebo antracitu, alebo 4 vrecia koksu.
        Doprava je v cene vreca. Ďalšie vrecia kuriérom by teoreticky ísť mohli,
        ale cena by prestala dávať zmysel.
      </li>
      <li>
        <strong>Režim predaja (od 100 kg).</strong>
        Od stovky kíl to nie je položka e-shopu. Je to tovar na objednávku:
        konfigurátor, formulár, doklad v SuperFaktúre. Preto nie „do
        košíka“, ale „k objednávke“. Paleta, neprevzatie a odstúpenie počas
        vychystania stoja peniaze.
      </li>
    </ol>
  </section>

  <section>
    <h2>Čo je v jednom vreci</h2>
    <ul>
      <li>Kováčske uhlie — 25 kg</li>
      <li>Kováčsky antracit — 25 kg</li>
      <li>Kováčsky koks — 20 kg</li>
    </ul>
    <p class="muted">100 kg a 200 kg idú na europaletu 80 × 120 cm. Väčšie množstvá na paletu 110 × 120 cm — sem ide 40 vriec uhlia alebo antracitu, alebo 50 vriec koksu, teda jedna tona. Niekedy príde aj 110 × 110 cm.</p>
  </section>

  <section>
    <h2>Solo vrecia</h2>
    <p class="muted">Tri samostatné položky: hobby kováči, nožiari, vzorky. Cena na dlaždici už zahŕňa balné aj doručenie SDS. Woo košík ostáva len pre tieto vrecia.</p>
    <p class="muted">Jedna zásielka má strop tri vrecia uhlia alebo antracitu a štyri vrecia koksu. Kto príde zvonku na 25 kg vrece, v detaile vidí dlaždicu „od 100 kg na objednávku“.</p>
  </section>

  <section>
    <h2>Od 100 kg: záväzná objednávka</h2>
    <p class="muted">V katalógu ostane e-shopová dlaždica „Kováčske uhlie od 100 kg“. Nie je to produkt. Klik ide rovno na podstránku Paleta s konfigurátorom. Cenník ostáva: 100 kg, sadzba z kíl daného paliva. Plus a mínus idú po jednom vreci. Uhlie, antracit a koks viete skombinovať — každé má vlastnú kartu, v súhrne sú položky. 100 kg antracitu + 100 kg koksu nie je 200 kg sadzba. Tlačidlo je „k objednávke“.</p>
    <p class="muted">Formulár berie údaje, ktoré SuperFaktúra potrebuje na doklad. Zákazník zvolí osobný odber alebo paletovú prepravu. Dopravu naceníte až podľa miesta — do prvého dokladu ide tovar.</p>
  </section>

  <section class="card">
    <h2>Čo na to WooCommerce</h2>
    <p class="muted">WooCommerce ostáva pre tri solo vrecia. Palivá, Paleta a Ako to predávame sú samostatné podstránky — nie Woo produkty, nie košík.</p>
    <ol>
      <li><strong>Dve plochy, nie dve Woo položky.</strong> Solo dlaždice ostávajú v e-shope. Dlaždice „od 100 kg“ idú na podstránku Paleta.</li>
      <li><strong>Solo = simple product.</strong> Max 3 / 4 kusy. Doprava v cene. V detaile vreca musí byť dlaždica na objednávku od 100 kg.</li>
      <li><strong>Od 100 kg = podstránka, nie produkt Woo.</strong> Cenník 100 / 250 / 500 / 1 000 kg (koks 200 namiesto 250) žije v konfigurátore. Doklad ide do SuperFaktúry.</li>
      <li><strong>Nerobte simple product „100 kg“.</strong> Zákazník dá do košíka 10 kusov a Woo spočíta 10 × cenu stovky.</li>
    </ol>
  </section>
</article>
<?php
return ob_get_clean();
