export const metadata = {
  title: "Ako to predávame",
};

export default function HowItWorksPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          Model katalógu
        </p>
        <h1 className="font-heading mt-2 text-4xl sm:text-5xl">
          Kde sa predaj láme
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Solo vrece je e-shopový produkt. Od 100 kg to e-shopový produkt
          nie je — je to tovar na objednávku. Rovnaký vzhľad dlaždíc, iné
          tlačidlo, iná podstránka, iné pravidlá. Text záväzku pred ostrým
          spustením overte s právnikom.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        <h2 className="font-heading text-3xl">Dve hranice, nie plynulý košík</h2>
        <ol className="list-decimal space-y-3 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Kuriér (jedna zásielka).</strong>{" "}
            Nie že auto neunesie desať vriec. Balíme jednu zásielku: 3 vrecia
            uhlia alebo antracitu, alebo 4 vrecia koksu. Doprava je v cene
            vreca. Ďalšie vrecia kuriérom by teoreticky ísť mohli, ale cena by
            prestala dávať zmysel. Toto upozornenie je na detaile 25 kg / 20 kg
            vreca — tam sa košík láme.
          </li>
          <li>
            <strong className="text-foreground">Režim predaja (od 100 kg).</strong>{" "}
            Od stovky kíl to nie je položka e-shopu. Je to tovar na objednávku:
            konfigurátor, formulár, doklad v SuperFaktúre. Preto nie „do
            košíka“, ale „k objednávke“. Paleta, neprevzatie a odstúpenie počas
            vychystania stoja peniaze.
          </li>
        </ol>
        <p className="leading-relaxed text-muted-foreground">
          Nad jednou zásielkou kuriérska cena prestáva dávať zmysel a paleta
          začína od 100 kg. Cesta je teda objednávka, nie ďalšie vrecia v
          košíku.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-3xl">Čo je v jednom vreci</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Kováčske uhlie — 25 kg</li>
          <li>Kováčsky antracit — 25 kg</li>
          <li>Kováčsky koks — 20 kg</li>
        </ul>
        <p className="leading-relaxed text-muted-foreground">
          Na paletu 110 × 120 cm ide 40 vriec uhlia alebo antracitu, alebo 50
          vriec koksu. Obidve cesty dajú jednu tonu.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-3xl">Solo vrecia</h2>
        <p className="leading-relaxed text-muted-foreground">
          Tri samostatné položky: hobby kováči, nožiari, vzorky. Cena na
          dlaždici už zahŕňa balné aj doručenie SDS. Dobierka a iný poplatok za
          platbu v nej nie sú.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Jedna zásielka má strop tri vrecia uhlia alebo antracitu a štyri
          vrecia koksu — nie preto, že kuriér viac neunesie, ale preto, že
          balík aj cena sedia len dovtedy. Kto príde zvonku na 25 kg vrece
          (fotka, zdieľaný odkaz), v detaile vidí dlaždicu „od 100 kg na
          objednávku“ — inak by o palete nevedel.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-3xl">Od 100 kg: záväzná objednávka</h2>
        <p className="leading-relaxed text-muted-foreground">
          V katalógu ostane e-shopová dlaždica „Kováčske uhlie od 100 kg“.
          Nie je to produkt. Klik ide rovno na objednávkovú podstránku s
          konfigurátorom. Cenník ostáva: 100 kg, sadzba z kíl daného paliva.
          Plus a mínus idú po jednom vreci. Uhlie, antracit a koks viete
          skombinovať — každé má vlastnú kartu, v súhrne sú položky. 100 kg
          antracitu + 100 kg koksu nie je 200 kg sadzba. Tlačidlo je „k
          objednávke“.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Formulár berie údaje, ktoré SuperFaktúra potrebuje na doklad (meno /
          firma, adresa, IČO, DIČ, IČ DPH, e-mail, telefón). Zákazník zvolí
          osobný odber alebo paletovú prepravu. Dopravu naceníte až podľa
          miesta — do prvého dokladu ide tovar.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Ostrá objednávka ide cez SuperFaktúra API (`type: order`). Bez kľúčov
          ostane náhľad. Znenie záväzku a výnimky z odstúpenia nie sú právna
          rada — pred spustením to dajte skontrolovať.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        <h2 className="font-heading text-3xl">Čo na to WooCommerce</h2>
        <p className="leading-relaxed text-muted-foreground">
          WooCommerce ostáva pre tri solo vrecia. Paleta do jeho košíka
          nepatrí — iné legislatívne pravidlá, drahá doprava, drahé
          neprevzatie.
        </p>
        <ol className="list-decimal space-y-3 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Dve plochy, nie dve Woo položky.</strong>{" "}
            V katalógu sú solo dlaždice (e-shop) a dlaždice „od 100 kg“
            (objednávka). Woo má držať len solo vrecia. Paleta do Woo košíka
            nepatrí.
          </li>
          <li>
            <strong className="text-foreground">Solo = simple product.</strong>{" "}
            Max 3 / 4 kusy (Min/Max Quantities alebo vlastný snippet).
            Dopravná trieda s 0 €, lebo doprava je v cene. Dobierka ako
            platobná metóda s poplatkom, nie ako súčasť produktu. V detaile
            vreca musí byť dlaždica / tlačidlo na objednávku od 100 kg.
          </li>
          <li>
            <strong className="text-foreground">
              Od 100 kg = tovar na objednávku, nie produkt Woo.
            </strong>{" "}
            Cenník 100 / 250 / 500 / 1 000 kg (koks 200 namiesto 250) ostáva
            v konfigurátore. Doklad ide do SuperFaktúry. Woo košík na palety
            nepoužívame práve kvôli odstúpeniu a drahému neprevzatiu.
          </li>
          <li>
            <strong className="text-foreground">
              Nerobte simple product „100 kg“.
            </strong>{" "}
            Zákazník dá do košíka 10 kusov a Woo spočíta 10 × cenu stovky.
            Paleta do Woo nepatrí; cenník žije v objednávke, nie v košíku.
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-3xl">Ceny v tomto náhľade</h2>
        <p className="leading-relaxed text-muted-foreground">
          Sumy sú vzorové, s DPH, na jedno miesto v{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            lib/catalog.ts
          </code>
          . Paletovú dopravu na veľkých množstvách naceníte podľa adresy, nie
          ju strhávať z košíka.
        </p>
      </section>
    </article>
  );
}
