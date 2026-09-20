import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-foreground/10 bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div>
          <p className="font-heading text-2xl">Kováčske palivá</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-background/70">
            Kováčske uhlie, antracit a koks. Solo vrecia kuriérom pre hobby
            vyhne. Od 100 kg záväzná paletová objednávka, nie košík.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-background/50">
            Objednávky
          </p>
          <p className="mt-2">
            <Link href="/objednavka-paleta" className="underline decoration-background/30 underline-offset-4">
              Paletová objednávka
            </Link>
          </p>
          <p className="text-background/70">Solo vrecia — košík. Paleta — SuperFaktúra.</p>
        </div>
        <div className="text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-background/50">
            Doručenie
          </p>
          <p className="mt-2">SDS kuriér — solo vrecia, doprava v cene</p>
          <p className="text-background/70">
            Europaleta 80 × 120 — 100 a 200 kg. Tona na 110 × 120 cm (niekedy 110 × 110).
          </p>
        </div>
      </div>
      <div className="border-t border-background/10 px-4 py-4 text-center text-xs text-background/50 sm:px-6">
        Dobierka a poplatok za platbu nie sú v cene tovaru.{" "}
        <Link href="/ako-to-predavame" className="underline decoration-background/30 underline-offset-4">
          Ako je katalóg poskladaný
        </Link>
      </div>
    </footer>
  );
}
