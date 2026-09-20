"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BulkCalculator } from "@/components/bulk-calculator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BULK_PRODUCTS,
  type FuelId,
  getFuel,
  getProduct,
} from "@/lib/catalog";
import { formatBagCount, formatKg, formatMoney, formatPerKg } from "@/lib/format";
import { quoteBulkLines } from "@/lib/pricing";
import {
  validatePalletOrder,
  type BuyerType,
  type Fulfillment,
  type PalletOrderInput,
} from "@/lib/superfaktura";

const STORAGE_KEY = "kovacske-paliva-pallet-order";

const EMPTY_KG: Record<FuelId, number> = {
  uhlie: 0,
  antracit: 0,
  koks: 0,
};

export function PalletOrderForm({
  initialFuelId,
  initialKg,
}: {
  initialFuelId?: FuelId;
  initialKg?: number;
}) {
  const router = useRouter();
  const startFuel = initialFuelId ?? "uhlie";
  const startProduct = getProduct(startFuel) ?? BULK_PRODUCTS[0];
  const startFuelData = getFuel(startProduct.fuelId);
  const [kgByFuel, setKgByFuel] = useState<Record<FuelId, number>>(() => ({
    ...EMPTY_KG,
    [startProduct.fuelId]: initialKg ?? startFuelData.bulkPresetsKg[0],
  }));
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pallet");
  const [buyerType, setBuyerType] = useState<BuyerType>("person");
  const [binding, setBinding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    ico: "",
    dic: "",
    icDph: "",
    note: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const lines = useMemo(
    () =>
      (Object.entries(kgByFuel) as [FuelId, number][])
        .filter(([, kg]) => kg >= 100)
        .map(([fuelId, kg]) => ({ fuelId, kg })),
    [kgByFuel],
  );
  const quote = useMemo(
    () => quoteBulkLines(lines, fulfillment),
    [lines, fulfillment],
  );

  function setFuelKg(fuelId: FuelId, kg: number) {
    setKgByFuel((current) => ({ ...current, [fuelId]: kg }));
  }

  function payload(): PalletOrderInput {
    return {
      lines,
      fulfillment,
      buyerType,
      name: form.name,
      email: form.email,
      phone: form.phone,
      street: form.street,
      city: form.city,
      zip: form.zip,
      ico: form.ico,
      dic: form.dic,
      icDph: form.icDph,
      note: form.note,
      binding,
    };
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const next = validatePalletOrder(payload());
    setFieldErrors(next as Record<string, string>);
    if (Object.keys(next).length > 0) {
      setFormError("Doplňte označené polia. Bez zaškrtnutia záväzku objednávka neide.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/paletova-objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const result = (await response.json()) as {
        ok: boolean;
        error?: string;
        orderId?: string;
        mocked?: boolean;
        goods?: number;
        kg?: number;
        bags?: number;
        fuelName?: string;
        fulfillment?: Fulfillment;
        message?: string;
        lines?: {
          fuelName: string;
          kg: number;
          bags: number;
          goods: number;
        }[];
      };
      if (!result.ok) {
        setFormError(result.error || "Objednávku sa nepodarilo odoslať.");
        setSubmitting(false);
        return;
      }
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      router.push("/objednavka-paleta/hotovo");
    } catch {
      setFormError("Spojenie zlyhalo. Skúste znova.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <div className="min-w-0 space-y-6">
        {BULK_PRODUCTS.map((item) => {
          const fuel = getFuel(item.fuelId);
          const kg = kgByFuel[item.fuelId];
          const included = kg >= fuel.bulkMinKg;
          return (
            <section
              key={item.id}
              className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:p-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">
                    {fuel.bagKg} kg / vrece
                  </p>
                  <h2 className="font-heading mt-1 text-2xl">{fuel.name}</h2>
                </div>
                <Button
                  type="button"
                  variant={included ? "outline" : "default"}
                  onClick={() => setFuelKg(item.fuelId, included ? 0 : fuel.bulkMinKg)}
                >
                  {included ? "Odstrániť" : "Pridať od 100 kg"}
                </Button>
              </div>
              <div className="mt-6">
                <BulkCalculator
                  product={item}
                  kg={kg}
                  onKgChange={(next) => setFuelKg(item.fuelId, next)}
                />
              </div>
            </section>
          );
        })}

        {fieldErrors.kg || fieldErrors.fuelId ? (
          <p className="text-sm text-destructive">
            {fieldErrors.kg || fieldErrors.fuelId}
          </p>
        ) : null}

        <section className="min-w-0 space-y-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:p-7">
          <h2 className="font-heading text-2xl">Údaje pre SuperFaktúru</h2>
          <p className="text-sm text-muted-foreground">
            Polia kopírujú klienta na doklade: meno, adresa, IČO, DIČ, IČ DPH,
            e-mail, telefón.
          </p>
          <RadioGroup
            value={buyerType}
            onValueChange={(value) => setBuyerType(value as BuyerType)}
          >
            <label className="flex cursor-pointer items-center gap-3">
              <RadioGroupItem value="person" />
              <Label className="cursor-pointer">Fyzická osoba</Label>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <RadioGroupItem value="company" />
              <Label className="cursor-pointer">Firma / živnosť</Label>
            </label>
          </RadioGroup>
          <Field
            label={buyerType === "company" ? "Názov firmy" : "Meno a priezvisko"}
            value={form.name}
            error={fieldErrors.name}
            onChange={(value) => setForm((current) => ({ ...current, name: value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="E-mail"
              type="email"
              value={form.email}
              error={fieldErrors.email}
              onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            />
            <Field
              label="Telefón"
              value={form.phone}
              error={fieldErrors.phone}
              onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            />
          </div>
          {buyerType === "company" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="IČO"
                value={form.ico}
                error={fieldErrors.ico}
                onChange={(value) => setForm((current) => ({ ...current, ico: value }))}
              />
              <Field
                label="DIČ"
                value={form.dic}
                onChange={(value) => setForm((current) => ({ ...current, dic: value }))}
              />
              <Field
                label="IČ DPH"
                value={form.icDph}
                onChange={(value) => setForm((current) => ({ ...current, icDph: value }))}
              />
            </div>
          ) : null}
          <Field
            label="Ulica a číslo"
            value={form.street}
            error={fieldErrors.street}
            onChange={(value) => setForm((current) => ({ ...current, street: value }))}
          />
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,9.5rem)]">
            <Field
              label="Mesto"
              value={form.city}
              error={fieldErrors.city}
              onChange={(value) => setForm((current) => ({ ...current, city: value }))}
            />
            <Field
              label="PSČ"
              value={form.zip}
              error={fieldErrors.zip}
              onChange={(value) => setForm((current) => ({ ...current, zip: value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="note">Poznámka k vykládke / odberu</Label>
            <textarea
              id="note"
              value={form.note}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              className="min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="Vysokozdvižný vozík, čas, vjazd…"
            />
          </div>
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:sticky sm:top-24">
        <h2 className="font-heading text-2xl">Živý prepočet</h2>
        {quote.lines.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Pridajte aspoň jedno palivo od 100 kg. Každá karta ostáva zvlášť,
            tu pribudnú položky.
          </p>
        ) : (
          <ul className="space-y-3">
            {quote.lines.map((line) => (
              <li
                key={line.fuel.id}
                className="border-b border-foreground/10 pb-3"
              >
                <div className="flex justify-between gap-3 text-sm font-medium">
                  <span>{line.fuel.name}</span>
                  <span className="tabular-nums">{formatMoney(line.goods)}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatKg(line.kg)} · {formatBagCount(line.bags)} ·{" "}
                  {formatPerKg(line.pricePerKg)} · {line.tier.label}
                </p>
                {line.savings > 0 ? (
                  <p className="mt-1 text-xs font-semibold text-primary">
                    Ušetríte {formatMoney(line.savings)} oproti cene za 100 kg
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {quote.lines.length > 0 && quote.shipment?.note ? (
          <p className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{quote.shipment.title}</span>
            {" · "}
            {quote.shipment.note}
          </p>
        ) : null}
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3 border-b border-foreground/10 py-1.5">
            <dt className="text-muted-foreground">Tovar s DPH</dt>
            <dd className="tabular-nums">{formatMoney(quote.goods)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-foreground/10 py-1.5">
            <dt className="text-muted-foreground">Odhad dopravy</dt>
            <dd className="tabular-nums">
              {fulfillment === "pickup"
                ? "0,00 € (osobný odber)"
                : `${formatMoney(quote.freight)} (odhad)`}
            </dd>
          </div>
        </dl>
        <p className="font-heading text-3xl">{formatMoney(quote.total)}</p>
        <p className="text-xs text-muted-foreground">
          Spolu = položky tovaru + odhad dopravy z celkových kíl zásielky.
          Zľava za množstvo sa na palivá nesčítava — 100 kg antracitu a 100 kg
          koksu sú dve stovky, nie jedna 200 kg sadzba. Do SuperFaktúry ide
          najprv tovar.
        </p>
        <RadioGroup
          value={fulfillment}
          onValueChange={(value) => setFulfillment(value as Fulfillment)}
        >
          <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/60">
            <RadioGroupItem value="pickup" />
            <span>
              <Label className="cursor-pointer">Prídem osobne</Label>
              <span className="block text-xs text-muted-foreground">
                Bez paletovej prepravy
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-muted/60">
            <RadioGroupItem value="pallet" />
            <span>
              <Label className="cursor-pointer">Pošlite paletou</Label>
              <span className="block text-xs text-muted-foreground">
                Dopravu naceníme podľa adresy
              </span>
            </span>
          </label>
        </RadioGroup>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-muted/50 p-3 text-sm">
          <Checkbox
            checked={binding}
            onCheckedChange={(checked) => setBinding(checked === true)}
            aria-invalid={Boolean(fieldErrors.binding)}
          />
          <span>
            Objednávam záväzne tento tovar. Rozumiem, že to nie je nákup v
            košíku, paletu treba vychystať a neprevzatie alebo zrušenie počas
            prípravy nesie náklady. Text pred ostrým spustením overte s právnikom.
          </span>
        </label>
        {fieldErrors.binding ? (
          <p className="text-xs text-destructive">{fieldErrors.binding}</p>
        ) : null}
        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Odosielam…" : "Odoslať záväznú objednávku"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Ostrý doklad ide cez SuperFaktúra API. Bez kľúčov ostane náhľad v
          prehliadači.{" "}
          <Link href="/ako-to-predavame" className="underline underline-offset-4">
            Dva režimy predaja
          </Link>
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-záäčďéíľňóôŕšťúýž0-9]+/gi, "-");
  return (
    <div className="grid min-w-0 gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
