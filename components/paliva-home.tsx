import Link from "next/link";
import { CatalogGrid } from "@/components/catalog-grid";
import { Button } from "@/components/ui/button";

export function PalivaHome() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">
            Do vyhne, nie do kotla
          </p>
          <h1 className="font-heading mt-3 max-w-xl text-4xl leading-[1.1] sm:text-5xl">
            Uhlie, koks a antracit tak, ako sa skutočne balia.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Solo vrece ide kuriérom, s dopravou v cene, ako e-shop. Od 100 kg
            je to paletová objednávka — iný režim, iné pravidlá, dopravu
            naceníme alebo si tovar vyzdvihnete.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button nativeButton={false} render={<Link href="/objednavka-paleta" />}>
              Paletová objednávka
            </Button>
            <Button nativeButton={false} render={<Link href="/ako-to-predavame" />} variant="outline">
              Prečo dva režimy
            </Button>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Vrece uhlia / antracitu" value="25 kg" />
          <Stat label="Vrece koksu" value="20 kg" />
          <Stat label="Paleta" value="110 × 120 cm" />
          <Stat label="Plná paleta" value="1 tona" />
        </dl>
      </section>
      <CatalogGrid />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
      <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="font-heading mt-1 text-2xl">{value}</dd>
    </div>
  );
}
