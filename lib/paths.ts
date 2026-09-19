import type { FuelId } from "@/lib/catalog";

export function palletOrderHref(fuelId?: FuelId, kg?: number) {
  const params = new URLSearchParams();
  if (fuelId) params.set("palivo", fuelId);
  if (kg && Number.isFinite(kg)) params.set("kg", String(kg));
  const query = params.toString();
  return query ? `/objednavka-paleta?${query}` : "/objednavka-paleta";
}
