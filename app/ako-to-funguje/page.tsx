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
          Dva predaje, nie šesť náhodných dlaždíc
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Kuriér a paleta sa nesmú tváriť ako ten istý tovar. Solo vrece je
          vzorka s dopravou v cene. Od 100 kg je to palivová zostava, kde sa
          oplatí brať viac.
        </p>
      </header>

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
          Kuriér má limit hmotnosti. Preto shop pustí najviac tri vrecia uhlia
          alebo antracitu a štyri vrecia koksu. Kto chce viac, ide do paletovej
          zostavy — nie do piateho vreca kuriérom.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-3xl">Od 100 kg: cena z celkových kíl</h2>
        <p className="leading-relaxed text-muted-foreground">
          Najmenšia zostava je 100 kg — štyri 25 kg vrecia, alebo päť 20 kg
          vriec koksu. V starom e-shope boli 100, 250, 500 a 1 000 kg ako
          oddelené ceny. To ostáva ako rýchly výber.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Klikanie „ešte jedna stovka“ za cenu stovky by zničilo zľavu: desať
          krát 100 kg by stálo ako drahá stovka, nie ako tona. Preto sa cena
          viaže na súčet kíl v košíku. 300 kg uhlia berie sadzbu od 250 kg, 1
          200 kg sadzbu palety.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Koks nemá 250 kg: 250 sa nedelí 20 kg vrecom. Namiesto toho je 200 kg
          (10 vriec). Uhlie a antracit 250 kg majú, lebo 10 × 25 kg sedí.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        <h2 className="font-heading text-3xl">Čo na to WooCommerce</h2>
        <p className="leading-relaxed text-muted-foreground">
          WooCommerce samo o sebe nevie „čím viac kíl, tým nižší €/kg“. Vie
          jednoduchý tovar, variácie a košíkové kupóny. Množstevná cena je
          plugin, alebo sa to nasimuluje variáciami.
        </p>
        <ol className="list-decimal space-y-3 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Dve kategórie.</strong> „Vzorky
            a hobby (kurier)“ a „Palivá od 100 kg (paleta)“. Iná dopravná
            trieda, iný skladový príbeh.
          </li>
          <li>
            <strong className="text-foreground">Solo = simple product.</strong>{" "}
            Max 3 / 4 kusy (Min/Max Quantities alebo vlastný snippet).
            Dopravná trieda s 0 €, lebo doprava je v cene. Dobierka ako
            platobná metóda s poplatkom, nie ako súčasť produktu.
          </li>
          <li>
            <strong className="text-foreground">
              Palivo = jeden produkt, nie štyri dlaždice.
            </strong>{" "}
            Buď variácie 100 / 250 / 500 / 1 000 kg — čisté Woo, bez pluginu,
            ale 300 kg sa nedá poskladať. Alebo jeden tovar predávaný po
            vreciach (min. 4 alebo 5) a plugin{" "}
            <em>Tiered Price Table</em> / <em>Dynamic Pricing</em> /{" "}
            <em>Wholesale Prices</em>, ktorý sadzbu berie z počtu vriec v
            košíku. To je model, ktorý beží tu.
          </li>
          <li>
            <strong className="text-foreground">
              Nerobte simple product „100 kg“.
            </strong>{" "}
            Zákazník dá do košíka 10 kusov a Woo spočíta 10 × cenu stovky.
            Paletová zľava sa neaplikuje, kým to plugin alebo variácia
            nerieši.
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
          . Paletová doprava je hrubý odhad podľa hmotnosti — v ostrej verzii
          ju nahraďte tarifou dopravcu.
        </p>
      </section>
    </article>
  );
}
