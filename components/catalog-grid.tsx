import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BagMark } from "@/components/bag-mark";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  BULK_PRODUCTS,
  SOLO_PRODUCTS,
  getFuel,
  palletKg,
  type CatalogProduct,
} from "@/lib/catalog";
import { formatMoney, formatPerKg } from "@/lib/format";
import { palletOrderHref } from "@/lib/paths";
import { bulkGoodsPrice } from "@/lib/pricing";

function priceHint(product: CatalogProduct) {
  const fuel = getFuel(product.fuelId);
  if (product.channel === "solo") {
    return {
      amount: formatMoney(fuel.soloPrice),
      note: "s doručením",
    };
  }
  const pallet = bulkGoodsPrice(fuel, palletKg(fuel));
  return {
    amount: formatPerKg(pallet.pricePerKg),
    note: `od 100 kg · paleta ${formatPerKg(pallet.pricePerKg)}`,
  };
}

export function ProductTile({ product }: { product: CatalogProduct }) {
  const fuel = getFuel(product.fuelId);
  const hint = priceHint(product);

  const href =
    product.channel === "solo"
      ? `/palivo/${product.slug}`
      : palletOrderHref(product.fuelId);

  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full transition-[transform,box-shadow] group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <Badge variant={product.channel === "solo" ? "secondary" : "default"}>
              {product.channel === "solo" ? "E-shop · kuriér" : "Na objednávku"}
            </Badge>
            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {fuel.bagKg} kg / vrece
            </span>
          </div>
          <div className="mx-auto h-36 w-28">
            <BagMark fuelId={fuel.id} weight={fuel.bagKg} />
          </div>
          <div>
            <h3 className="font-heading text-2xl leading-tight">{product.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.lead}
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <div>
            <p className="font-heading text-xl">{hint.amount}</p>
            <p className="text-xs text-muted-foreground">{hint.note}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            {product.channel === "solo" ? "Do košíka" : "K objednávke"}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardFooter>
      </Card>
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
              Hobby · vzorky · kuriér
            </p>
            <h2 className="font-heading mt-1 text-3xl">Solo vrecia s doručením</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Cena už obsahuje balné aj dopravu SDS. Dobierka sa účtuje zvlášť.
            Kuriér unesie najviac 3 vrecia uhlia/antracitu alebo 4 vrecia koksu.
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
              Paleta 110 × 120 cm
            </p>
            <h2 className="font-heading mt-1 text-3xl">Na objednávku od 100 kg</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Dlaždica vyzerá ako v e-shope, ale to nie je produkt do košíka.
            Klik ide na konfigurátor a záväznú objednávku.
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
