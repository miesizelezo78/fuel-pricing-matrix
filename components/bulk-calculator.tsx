"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PalletMeter, PriceLadder } from "@/components/price-ladder";
import { getFuel, type CatalogProduct } from "@/lib/catalog";
import { formatKg, formatMoney, formatPerKg } from "@/lib/format";
import { clampBulkKg, quoteBulk } from "@/lib/pricing";

export function BulkCalculator({
  product,
  kg,
  onKgChange,
}: {
  product: CatalogProduct;
  kg: number;
  onKgChange: (kg: number) => void;
}) {
  const fuel = getFuel(product.fuelId);
  const included = kg >= fuel.bulkMinKg;
  const quote = included ? quoteBulk(product, kg) : null;
  const maxKg = 10_000;

  function step(delta: number) {
    if (!included && delta > 0) {
      onKgChange(fuel.bulkMinKg);
      return;
    }
    if (included && delta < 0 && quote && quote.kg <= fuel.bulkMinKg) {
      onKgChange(0);
      return;
    }
    const next = (quote?.kg ?? 0) + delta;
    onKgChange(clampBulkKg(fuel, next, true));
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Sadzba ide z kíl tohto paliva, nie zo súčtu objednávky. Plus a mínus
        pridávajú jedno vrece ({fuel.bagKg} kg).
      </p>
      <div className="flex flex-wrap gap-2">
        {fuel.bulkPresetsKg.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={quote?.kg === preset ? "default" : "outline"}
            onClick={() => onKgChange(preset)}
          >
            {preset === 1000 ? "1 000 kg" : `${preset} kg`}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium">
          Vlastné množstvo po {fuel.bagKg} kg (1 vrece)
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => step(-fuel.bagKg)}
            disabled={!included}
            aria-label={`Menej o ${fuel.bagKg} kg`}
          >
            <Minus />
          </Button>
          <span className="min-w-24 text-center font-heading text-2xl tabular-nums">
            {included && quote ? formatKg(quote.kg) : "0 kg"}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => step(fuel.bagKg)}
            disabled={(quote?.kg ?? 0) >= maxKg}
            aria-label={`Viac o ${fuel.bagKg} kg`}
          >
            <Plus />
          </Button>
        </div>
      </div>
      {fuel.id === "koks" ? (
        <p className="text-xs text-muted-foreground">
          Koks je vo 20 kg vreciach, preto tu nie je tlačidlo 250 kg — nevyšlo
          by to na celé vrecia. Presety sú 200 kg (10 vriec) a 500 kg. Plusom
          idete 220, 240, 260 kg.
        </p>
      ) : null}
      {!included ? (
        <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          Toto palivo v objednávke nie je. Preset alebo plus pridá od 100 kg.
        </p>
      ) : null}
      <PriceLadder fuel={fuel} selectedKg={quote?.kg ?? 0} />
      <PalletMeter fuel={fuel} kg={quote?.kg ?? 0} />
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-muted/50 p-3">
          <dt className="text-muted-foreground">Vrecia</dt>
          <dd className="font-medium">
            {included && quote
              ? `${quote.bags} × ${fuel.bagKg} kg`
              : "—"}
          </dd>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <dt className="text-muted-foreground">Cena tovaru</dt>
          <dd className="font-medium">
            {included && quote ? (
              <>
                {formatPerKg(quote.pricePerKg)} · {formatMoney(quote.goods)}
                {quote.savings > 0 ? (
                  <span className="mt-1 block text-xs font-semibold text-primary">
                    Ušetríte {formatMoney(quote.savings)} oproti cene za 100 kg
                  </span>
                ) : null}
              </>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 col-span-2">
          <dt className="text-muted-foreground">Paletová doprava</dt>
          <dd className="font-medium">
            Odhad podľa súčtu všetkých palív v súhrne. Do SuperFaktúry ide
            zatiaľ len tovar.
          </dd>
        </div>
      </dl>
    </div>
  );
}
