"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, usePricedCart } from "@/components/cart-provider";
import { formatMoney } from "@/lib/format";

type FormState = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  note: string;
};

const empty: FormState = {
  name: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  zip: "",
  note: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const { ready, priced, cart } = usePricedCart();
  const { clear } = useCart();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Načítavam objednávku…</p>;
  }

  if (priced.pricedLines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-foreground/20 bg-card px-6 py-16 text-center">
        <p className="font-heading text-3xl">Nie je čo objednať</p>
        <p className="mt-2 text-muted-foreground">
          Košík je prázdny. Najprv vyberte palivo.
        </p>
        <Button nativeButton={false} render={<Link href="/" />} className="mt-6">
          Do katalógu
        </Button>
      </div>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 3) next.name = "Zadajte meno a priezvisko.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Zadajte platný e-mail.";
    }
    if (form.phone.replace(/\s/g, "").length < 9) {
      next.phone = "Zadajte telefón.";
    }
    if (form.street.trim().length < 4) next.street = "Zadajte ulicu a číslo.";
    if (form.city.trim().length < 2) next.city = "Zadajte mesto.";
    if (!/^\d{3}\s?\d{2}$/.test(form.zip.trim())) {
      next.zip = "PSČ v tvare 000 00.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const orderId = `KP-${Date.now().toString().slice(-8)}`;
    const payload = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: form,
      payment: cart.payment,
      lines: priced.pricedLines.map((line) => ({
        name: line.product.name,
        kg: line.kg,
        bags: line.bags,
        goods: line.goods,
      })),
      totals: {
        goods: priced.goods,
        freight: priced.freight,
        cod: priced.cod,
        total: priced.total,
      },
    };
    window.sessionStorage.setItem("kovacske-paliva-order", JSON.stringify(payload));
    clear();
    router.push("/objednavka/hotovo");
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
      <div className="space-y-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-2xl">Dodacie údaje</h2>
        <Field
          label="Meno a priezvisko"
          value={form.name}
          error={errors.name}
          onChange={(value) => update("name", value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="E-mail"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(value) => update("email", value)}
          />
          <Field
            label="Telefón"
            value={form.phone}
            error={errors.phone}
            onChange={(value) => update("phone", value)}
          />
        </div>
        <Field
          label="Ulica a číslo"
          value={form.street}
          error={errors.street}
          onChange={(value) => update("street", value)}
        />
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,11rem)]">
          <Field
            label="Mesto"
            value={form.city}
            error={errors.city}
            onChange={(value) => update("city", value)}
          />
          <Field
            label="PSČ"
            value={form.zip}
            error={errors.zip}
            onChange={(value) => update("zip", value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="note">Poznámka k vykládke</Label>
          <Input
            id="note"
            value={form.note}
            onChange={(event) => update("note", event.target.value)}
            placeholder="Vysokozdvižný vozík, čas doručenia…"
          />
        </div>
      </div>
      <aside className="h-fit space-y-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-2xl">Rekapitulácia</h2>
        <ul className="space-y-2 text-sm">
          {priced.pricedLines.map((line) => (
            <li key={line.product.id} className="flex justify-between gap-3">
              <span>
                {line.product.name}
                <span className="block text-xs text-muted-foreground">
                  {line.unitLabel}
                </span>
              </span>
              <span className="tabular-nums">{formatMoney(line.goods)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between text-sm">
          <span>Doprava paletou</span>
          <span>{priced.freight > 0 ? formatMoney(priced.freight) : "v cene"}</span>
        </p>
        <p className="flex justify-between text-sm">
          <span>Platba</span>
          <span>
            {cart.payment === "cod"
              ? `Dobierka ${formatMoney(priced.cod)}`
              : "Prevodom"}
          </span>
        </p>
        <p className="flex items-end justify-between border-t border-foreground/10 pt-3">
          <span className="text-sm text-muted-foreground">Celkom</span>
          <span className="font-heading text-3xl">{formatMoney(priced.total)}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Toto je vzorová objednávka bez platobnej brány. Údaje zostanú v
          prehliadači.
        </p>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Odosielam…" : "Odoslať objednávku"}
        </Button>
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
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="grid min-w-0 gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        aria-invalid={Boolean(error)}
        className="w-full min-w-0 max-w-full"
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
