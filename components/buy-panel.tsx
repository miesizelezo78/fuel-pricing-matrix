"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getFuel, type CatalogProduct } from "@/lib/catalog";
import { formatKg, formatMoney, formatPerKg } from "@/lib/format";
import { quoteBulk, quoteSolo } from "@/lib/pricing";
import { useCart } from "@/components/cart-provider";
import { PalletMeter, PriceLadder } from "@/components/price-ladder";

export function BuyPanel({ product }: { product: CatalogProduct }) {
  if (product.channel === "solo") {
    return <SoloBuy product={product} />;
  }
  return <BulkBuy product={product} />;
}

function SoloBuy({ product }: { product: CatalogProduct }) {
  const fuel = getFuel(product.fuelId);
  const [bags, setBags] = useState(1);
  const { addBags } = useCart();
  const router = useRouter();
  const quote = quoteSolo(product, bags);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-muted/60 p-4 text-sm leading-relaxed">
        Cena <strong>{formatMoney(fuel.soloPrice)}</strong> za vrece už obsahuje
        balné aj doručenie kuriérom SDS. Dobierka ani iný poplatok za platbu v
        nej nie sú. Kuriér unesie najviac{" "}
        <strong>
          {fuel.soloMaxBags} {fuel.soloMaxBags === 4 ? "vrecia" : "vrecia"}{" "}
          {fuel.adjective}
        </strong>
        .
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium">Počet vriec</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setBags((value) => Math.max(1, value - 1))}
            disabled={bags <= 1}
            aria-label="Menej vriec"
          >
            <Minus />
          </Button>
          <span className="w-10 text-center font-heading text-2xl tabular-nums">
            {bags}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setBags((value) => Math.min(fuel.soloMaxBags, value + 1))}
            disabled={bags >= fuel.soloMaxBags}
            aria-label="Viac vriec"
          >
            <Plus />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {quote.bags} × {fuel.bagKg} kg = {formatKg(quote.kg)} · doprava v cene
      </p>
      <div className="flex items-end justify-between border-t border-foreground/10 pt-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            S doručením
          </p>
          <p className="font-heading text-3xl">{formatMoney(quote.goods)}</p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            const ok = addBags(product.id, bags);
            if (ok) {
              toast.success("Vrece je v košíku.");
              router.push("/kosik");
            }
          }}
        >
          Do košíka
        </Button>
      </div>
    </div>
  );
}

function BulkBuy({ product }: { product: CatalogProduct }) {
  const fuel = getFuel(product.fuelId);
  const [kg, setKg] = useState(fuel.bulkPresetsKg[0]);
  const { addBags } = useCart();
  const router = useRouter();
  const quote = useMemo(() => quoteBulk(product, kg), [product, kg]);

  function step(delta: number) {
    setKg((current) => {
      const next = current + delta;
      if (next < fuel.bulkMinKg) return fuel.bulkMinKg;
      return Math.round(next / fuel.bagKg) * fuel.bagKg;
    });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Neklikáte 100 kg balíky za pevnú cenu. Vyberiete hmotnosť — cena za
        kilogram sa pretiahne podľa celkových kíl. Dve zostavy po 100 kg teda
        nie sú 2 × drahšia stovka, ale jedna 200 kg cena.
      </p>
      <div className="flex flex-wrap gap-2">
        {fuel.bulkPresetsKg.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={kg === preset ? "default" : "outline"}
            onClick={() => setKg(preset)}
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
            disabled={kg <= fuel.bulkMinKg}
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
        <div className="rounded-lg bg-muted/50 p-3">
          <dt className="text-muted-foreground">Odhad paletovej dopravy</dt>
          <dd className="font-medium">{formatMoney(quote.freight)}</dd>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <dt className="text-muted-foreground">Úspora oproti 100 kg cene</dt>
          <dd className="font-medium">
            {quote.savings > 0 ? `−${formatMoney(quote.savings)}` : "—"}
          </dd>
        </div>
      </dl>
      <div className="flex items-end justify-between border-t border-foreground/10 pt-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Tovar + odhad dopravy
          </p>
          <p className="font-heading text-3xl">
            {formatMoney(quote.goods + quote.freight)}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            addBags(product.id, quote.bags);
            toast.success("Zostava je v košíku. Cena sa prerátava z celkových kíl.");
            router.push("/kosik");
          }}
        >
          Do košíka
        </Button>
      </div>
    </div>
  );
}
