import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  BULK_PRODUCTS,
  SOLO_PRODUCTS,
  getFuel,
  type CatalogProduct,
} from "@/lib/catalog";
import {
  SITE_FUEL_PHOTO,
  WOO_PRODUCT,
  palletOrderHref,
} from "@/lib/paths";

function tileHref(product: CatalogProduct) {
  if (product.channel === "solo") {
    return WOO_PRODUCT[product.fuelId];
  }
  return palletOrderHref(product.fuelId);
}

function ProductTile({ product }: { product: CatalogProduct }) {
  const fuel = getFuel(product.fuelId);
  const href = tileHref(product);
  const isSolo = product.channel === "solo";
  const pack = isSolo
    ? `Vrece · ${fuel.bagKg} kg`
    : "Na objednávku · od 100 kg";
  const action = isSolo ? "Pozrieť produkt" : "K objednávke";

  const inner = (
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-[transform,box-shadow] group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <img
          src={SITE_FUEL_PHOTO}
          alt={product.name}
          width={300}
          height={300}
          className="aspect-square w-full object-cover"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {product.eyebrow}
          </p>
          <h3 className="font-heading text-xl leading-snug">{product.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.lead}
          </p>
          <p className="text-sm text-muted-foreground">{pack}</p>
          <p className="mt-auto pt-3 text-sm font-medium">
            {isSolo ? "s doručením" : "Cena podľa množstva"}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            {action}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
  );

  if (isSolo) {
    return (
      <a href={href} className="group block h-full">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="group block h-full">
      {inner}
    </Link>
  );
}

export function CatalogGrid() {
  return (
    <div className="space-y-12">
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              E-shop · kuriér
            </p>
            <h2 className="font-heading mt-1 text-3xl">Vrecia s doručením</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Klik ide na Woo produkt — fotka, popis, košík. Jedna zásielka: 3
            vrecia uhlia alebo antracitu, 4 vrecia koksu.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLO_PRODUCTS.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              Nie košík
            </p>
            <h2 className="font-heading mt-1 text-3xl">Od 100 kg</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Rovnaká karta ako v e-shope, iné tlačidlo. Klik ide na konfigurátor
            s predvybraným palivom.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BULK_PRODUCTS.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
