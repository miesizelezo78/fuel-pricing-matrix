"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getFuel, type CatalogProduct } from "@/lib/catalog";
import { formatKg, formatMoney } from "@/lib/format";
import { palletOrderHref } from "@/lib/paths";
import { quoteSolo } from "@/lib/pricing";
import { useCart } from "@/components/cart-provider";

export function BuyPanel({ product }: { product: CatalogProduct }) {
  return <SoloBuy product={product} />;
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
        Toto je e-shopové vrece. Cena <strong>{formatMoney(fuel.soloPrice)}</strong>{" "}
        už obsahuje balné aj doručenie kuriérom SDS. Jedna zásielka je balená
        ako balík: najviac{" "}
        <strong>
          {fuel.soloMaxBags} vrecia {fuel.adjective}
        </strong>
        . Desať vriec kuriérom by ísť mohlo, ale cena by prestala dávať zmysel —
        od 100 kg je tovar na objednávku.
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
      <div className="flex flex-col gap-3 border-t border-foreground/10 pt-4 sm:flex-row sm:items-end sm:justify-between">
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
      <Button
        nativeButton={false}
        render={<Link href={palletOrderHref(fuel.id)} />}
        variant="outline"
        className="h-10 w-full"
      >
        Viac ako {fuel.soloMaxBags} vrecia → k objednávke od 100 kg
      </Button>
    </div>
  );
}
