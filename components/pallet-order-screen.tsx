"use client";

import { use } from "react";
import { PalletOrderForm } from "@/components/pallet-order-form";
import { isFuelId } from "@/lib/catalog";

export function PalletOrderScreen({
  searchParams,
}: {
  searchParams: Promise<{ palivo?: string; kg?: string }>;
}) {
  const params = use(searchParams);
  const fuelId = isFuelId(params.palivo) ? params.palivo : undefined;
  const parsedKg = params.kg ? Number(params.kg) : undefined;
  const kg = Number.isInteger(parsedKg) ? parsedKg : undefined;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-primary sm:text-sm">
          Nie košík · záväzná objednávka
        </p>
        <h1 className="font-heading mt-2 text-4xl leading-[1.12] sm:text-5xl lg:text-[3.35rem]">
          Kováčske palivá od 100 kg
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Vrecia s doručením ostávajú v e-shope. Od 100 kg to nie je košík —
          uhlie, antracit a koks viete dať do jednej objednávky. Každé palivo
          má vlastnú kartu a vlastnú sadzbu. Paleta je jednorazová, nevratná
          a v cene tovaru.
        </p>
      </div>
      <PalletOrderForm initialFuelId={fuelId} initialKg={kg} />
    </div>
  );
}
