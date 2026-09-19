"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PalletMeter, PriceLadder } from "@/components/price-ladder";
import { getFuel, type CatalogProduct } from "@/lib/catalog";
import { formatKg, formatMoney, formatPerKg } from "@/lib/format";
import { bulkKgOptions, clampBulkKg, quoteBulk } from "@/lib/pricing";

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
  const quote = quoteBulk(product, kg);
  const options = bulkKgOptions(fuel);
  const maxKg = options[options.length - 1] ?? fuel.bulkMinKg;

  function step(delta: number) {
    onKgChange(clampBulkKg(fuel, quote.kg + delta));
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Cena za kilogram ide z celkových kíl, nie z počtu klikov na stovku. Toto
        nie je e-shopový košík — ide o záväznú paletovú objednávku.
      </p>
      <div className="flex flex-wrap gap-2">
        {fuel.bulkPresetsKg.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={quote.kg === preset ? "default" : "outline"}
            onClick={() => onKgChange(preset)}
          >
            {preset === 1000 ? "1 000 kg" : `${preset} kg`}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium">Vlastné množstvo po 100 kg</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => step(-fuel.bulkStepKg)}
            disabled={quote.kg <= fuel.bulkMinKg}
            aria-label="Menej o 100 kg"
          >
            <Minus />
          </Button>
          <span className="min-w-24 text-center font-heading text-2xl tabular-nums">
            {formatKg(quote.kg)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => step(fuel.bulkStepKg)}
            disabled={quote.kg >= maxKg}
            aria-label="Viac o 100 kg"
          >
            <Plus />
          </Button>
        </div>
      </div>
      {fuel.id === "koks" ? (
        <p className="text-xs text-muted-foreground">
          Koks je vo 20 kg vreciach, preto tu nie je 250 kg — nevyšlo by to na
          celé vrecia. Najbližšie zostavy sú 200 kg (10 vriec) a 300 kg (15 vriec).
        </p>
      ) : null}
      <PriceLadder fuel={fuel} selectedKg={quote.kg} />
      <PalletMeter fuel={fuel} kg={quote.kg} />
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-muted/50 p-3">
          <dt className="text-muted-foreground">Vrecia</dt>
          <dd className="font-medium">
            {quote.bags} × {fuel.bagKg} kg
          </dd>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <dt className="text-muted-foreground">Cena tovaru</dt>
          <dd className="font-medium">
            {formatPerKg(quote.pricePerKg)} · {formatMoney(quote.goods)}
          </dd>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 col-span-2">
          <dt className="text-muted-foreground">Paletová doprava</dt>
          <dd className="font-medium">
            Naceníme podľa miesta, alebo osobný odber. Do SuperFaktúry ide zatiaľ
            len tovar.
          </dd>
        </div>
      </dl>
    </div>
  );
}
