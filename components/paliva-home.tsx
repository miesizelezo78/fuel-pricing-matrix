import Link from "next/link";
import { CatalogGrid } from "@/components/catalog-grid";
import { Button } from "@/components/ui/button";
import { SITE_HUB, SITE_SHOP } from "@/lib/paths";

export function PalivaHome() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">
            Náhľad dlaždíc pre Woo
          </p>
          <h1 className="font-heading mt-3 max-w-xl text-4xl leading-[1.1] sm:text-5xl">
            Vrecia s doručením a paleta od 100 kg.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sprievodca (video, tri charaktery) žije na{" "}
            <a href={SITE_HUB} className="underline underline-offset-2">
              /kovacske-paliva/
            </a>
            . Tieto karty patria do obchodu. Solo karta otvorí Woo produkt. Karta
            od 100 kg otvorí konfigurátor.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button nativeButton={false} render={<a href={SITE_SHOP} />}>
              Woo Kováčske palivá
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/objednavka-paleta" />}
              variant="outline"
            >
              Paletová objednávka
            </Button>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Vrece uhlia / antracitu" value="25 kg" />
          <Stat label="Vrece koksu" value="20 kg" />
          <Stat label="100–200 kg" value="80 × 120 cm" />
          <Stat label="1 tona" value="110 × 120 cm" />
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
