"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatKg, formatMoney } from "@/lib/format";

type StoredOrder = {
  orderId: string;
  totals: { total: number };
  lines: { name: string; kg: number; bags: number }[];
};

function subscribe() {
  return () => {};
}

function clientTrue() {
  return true;
}

let orderSnapshot: { raw: string | null; order: StoredOrder | null } = {
  raw: null,
  order: null,
};

function readOrder(): StoredOrder | null {
  try {
    const raw = window.sessionStorage.getItem("kovacske-paliva-order");
    if (raw === orderSnapshot.raw) return orderSnapshot.order;
    const order = raw ? (JSON.parse(raw) as StoredOrder) : null;
    orderSnapshot = { raw, order };
    return order;
  } catch {
    orderSnapshot = { raw: null, order: null };
    return null;
  }
}

export function OrderDone() {
  const hydrated = useSyncExternalStore(subscribe, clientTrue, () => false);
  const order = useSyncExternalStore(subscribe, readOrder, () => null);

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Overujem objednávku…</p>;
  }

  if (!order) {
    return (
      <div className="rounded-2xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
        <p className="font-heading text-3xl">Objednávka sa nenašla</p>
        <p className="mt-2 text-muted-foreground">
          Táto stránka ukáže potvrdenie až po odoslaní formulára.
        </p>
        <Button nativeButton={false} render={<Link href="/" />} className="mt-6">
          Do katalógu
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card px-6 py-12 ring-1 ring-foreground/10">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">
        Objednávka prijatá
      </p>
      <h1 className="font-heading mt-2 text-4xl">{order.orderId}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Vzorová objednávka je uložená v tomto prehliadači. V ostrom e-shope by
        odišla e-mailom a do WooCommerce / účtovníctva.
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        {order.lines.map((line) => (
          <li key={line.name}>
            {line.name} · {line.bags} vriec · {formatKg(line.kg)}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-heading text-2xl">{formatMoney(order.totals.total)}</p>
      <Button nativeButton={false} render={<Link href="/" />} className="mt-8">
        Ďalší nákup
      </Button>
    </div>
  );
}
