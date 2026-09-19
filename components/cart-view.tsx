"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { BagMark } from "@/components/bag-mark";
import { useCart, usePricedCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { COD_FEE_EUR, getFuel } from "@/lib/catalog";
import { formatKg, formatMoney } from "@/lib/format";

export function CartView() {
  const { ready, priced } = usePricedCart();
  const { setBags, remove, setPayment, cart } = useCart();

  if (!ready) {
    return (
      <p className="text-sm text-muted-foreground">Načítavam košík…</p>
    );
  }

  if (priced.pricedLines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-foreground/20 bg-card px-6 py-16 text-center">
        <p className="font-heading text-3xl">Košík je prázdny</p>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Solo vrece s kuriérom. Paleta od 100 kg ide ako záväzná objednávka,
          nie touto cestou.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button nativeButton={false} render={<Link href="/" />}>
            Do katalógu
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
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
      <div className="space-y-4">
        {priced.pricedLines.map((line) => {
          const fuel = getFuel(line.fuel.id);
          return (
            <article
              key={line.product.id}
              className="flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center"
            >
              <div className="h-24 w-20 shrink-0">
                <BagMark fuelId={fuel.id} weight={fuel.bagKg} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {line.product.eyebrow}
                </p>
                <h2 className="font-heading text-2xl leading-tight">
                  {line.product.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {line.unitLabel} · {formatKg(line.kg)}
                </p>
                <p className="text-sm text-muted-foreground">{line.detail}</p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <p className="font-heading text-xl">{formatMoney(line.goods)}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setBags(line.product.id, line.bags - 1)}
                    aria-label="Znížiť množstvo"
                  >
                    −
                  </Button>
                  <span className="w-8 text-center tabular-nums">{line.bags}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={line.bags >= fuel.soloMaxBags}
                    onClick={() => setBags(line.product.id, line.bags + 1)}
                    aria-label="Zvýšiť množstvo"
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(line.product.id)}
                    aria-label="Odstrániť"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <aside className="h-fit rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-2xl">Súčet</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>Tovar</dt>
            <dd className="tabular-nums">{formatMoney(priced.goods)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Doprava kuriérom</dt>
            <dd className="tabular-nums">v cene</dd>
          </div>
        </dl>
        <Separator className="my-4" />
        <p className="text-sm font-medium">Platba</p>
        <RadioGroup
          value={cart.payment}
          onValueChange={(value) => setPayment(value as "transfer" | "cod")}
          className="mt-2"
        >
          <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/60">
            <RadioGroupItem value="transfer" />
            <span>
              <Label className="cursor-pointer">Prevodom</Label>
              <span className="block text-xs text-muted-foreground">
                Bez príplatku
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/60">
            <RadioGroupItem value="cod" />
            <span>
              <Label className="cursor-pointer">Dobierka</Label>
              <span className="block text-xs text-muted-foreground">
                +{formatMoney(COD_FEE_EUR)} — nie je v cene vreca ani palety
              </span>
            </span>
          </label>
        </RadioGroup>
        {priced.cod > 0 ? (
          <div className="mt-3 flex justify-between text-sm">
            <span>Dobierka</span>
            <span className="tabular-nums">{formatMoney(priced.cod)}</span>
          </div>
        ) : null}
        <div className="mt-4 flex items-end justify-between">
          <span className="text-sm text-muted-foreground">Celkom</span>
          <span className="font-heading text-3xl">{formatMoney(priced.total)}</span>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/objednavka" />}
          size="lg"
          className="mt-5 w-full"
        >
          Pokračovať k objednávke
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Od 100 kg to nie je tento košík.{" "}
          <Link href="/objednavka-paleta" className="underline underline-offset-4">
            Paletová objednávka
          </Link>
        </p>
      </aside>
    </div>
  );
}
