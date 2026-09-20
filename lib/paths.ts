import type { FuelId } from "@/lib/catalog";

export const SITE_HUB =
  "https://staging.vulcanus.sk/kovacske-paliva/";
export const SITE_SHOP =
  "https://staging.vulcanus.sk/?ukazka=obchod&rodina=kovacske-paliva";
export const SITE_FUEL_PHOTO = "/kovacske-paliva-vyhen.jpg";

export const WOO_PRODUCT: Record<FuelId, string> = {
  uhlie: "https://staging.vulcanus.sk/produkt/kovacske-cierne-uhlie-25-kg",
  antracit: "https://staging.vulcanus.sk/produkt/kovacsky-antracit-25-kg",
  koks: "https://staging.vulcanus.sk/produkt/kovacsky-koks-20-kg",
};

export function palletOrderHref(fuelId?: FuelId, kg?: number) {
  const params = new URLSearchParams();
  if (fuelId) params.set("palivo", fuelId);
  if (typeof kg === "number" && Number.isInteger(kg) && kg > 0) {
    params.set("kg", String(kg));
  }
  const query = params.toString();
  return query ? `/objednavka-paleta?${query}` : "/objednavka-paleta";
}
