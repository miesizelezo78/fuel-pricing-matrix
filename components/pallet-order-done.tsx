"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatBagCount, formatKg, formatMoney } from "@/lib/format";

type Stored = {
  orderId: string;
  mocked?: boolean;
  goods?: number;
  kg?: number;
  bags?: number;
  fuelName?: string;
  fulfillment?: "pickup" | "pallet";
  message?: string;
};

function subscribe() {
  return () => {};
}

function clientTrue() {
  return true;
}

let snapshot: { raw: string | null; order: Stored | null } = {
  raw: null,
  order: null,
};

function readOrder(): Stored | null {
  try {
    const raw = window.sessionStorage.getItem("kovacske-paliva-pallet-order");
    if (raw === snapshot.raw) return snapshot.order;
    const order = raw ? (JSON.parse(raw) as Stored) : null;
    snapshot = { raw, order };
    return order;
  } catch {
    snapshot = { raw: null, order: null };
    return null;
  }
}

export function PalletOrderDone() {
  const hydrated = useSyncExternalStore(subscribe, clientTrue, () => false);
  const order = useSyncExternalStore(subscribe, readOrder, () => null);

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Overujem objednávku…</p>;
  }

  if (!order) {
    return (
      <div className="rounded-2xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
        <p className="font-heading text-3xl">Objednávka sa nenašla</p>
        <Button
          nativeButton={false}
          render={<Link href="/objednavka-paleta" />}
          className="mt-6"
        >
          K paletovej objednávke
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card px-6 py-12 ring-1 ring-foreground/10">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">
        {order.mocked ? "Náhľad bez SuperFaktúry" : "Objednávka v SuperFaktúre"}
      </p>
      <h1 className="font-heading mt-2 text-4xl">{order.orderId}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{order.message}</p>
      <ul className="mt-6 space-y-1 text-sm">
        <li>
            {order.fuelName} · {formatBagCount(order.bags ?? 0)} · {formatKg(order.kg ?? 0)}
        </li>
        <li>
          {order.fulfillment === "pickup"
            ? "Osobný odber"
            : "Paletová preprava — dopravu naceníme"}
        </li>
      </ul>
      <p className="mt-4 font-heading text-2xl">
        {formatMoney(order.goods ?? 0)}
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="mt-8">
        Späť k palivám
      </Button>
    </div>
  );
}
