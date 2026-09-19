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
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          Nie košík · záväzná objednávka
        </p>
        <h1 className="font-heading mt-1 text-4xl sm:text-5xl">
          Paletový predaj od 100 kg
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Rovnaký cenník ako v náhľade, ale tovar nejde do e-shopového košíka.
          Klik z dlaždice „od 100 kg“ aj z detailu 25 kg vreca končí tu:
          konfigurátor, údaje pre SuperFaktúru, záväzná objednávka. Paletovú
          dopravu naceníme, alebo si tovar vyzdvihnete.
        </p>
      </div>
      <PalletOrderForm initialFuelId={fuelId} initialKg={kg} />
    </div>
  );
}
