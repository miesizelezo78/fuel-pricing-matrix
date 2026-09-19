export type FuelId = "uhlie" | "antracit" | "koks";
export type Channel = "solo" | "bulk";

export type PriceTier = {
  minKg: number;
  pricePerKg: number;
  label: string;
};

export type Fuel = {
  id: FuelId;
  name: string;
  shortName: string;
  adjective: string;
  bagKg: number;
  palletBags: number;
  soloMaxBags: number;
  soloPrice: number;
  bulkPresetsKg: number[];
  bulkMinKg: number;
  bulkStepKg: number;
  tiers: PriceTier[];
  color: string;
  grain: string;
  summary: string;
  use: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  channel: Channel;
  fuelId: FuelId;
  name: string;
  eyebrow: string;
  lead: string;
};

export const PALLET_CM = { width: 110, depth: 120 } as const;

/** Sample COD fee. Payment-method charges are never bundled into product prices. */
export const COD_FEE_EUR = 2.9;

/** Slovak standard VAT. SuperFaktúra items send net + this rate. */
export const VAT_RATE = 23;

/** Cap for one pallet order — ten full 1 t pallets. */
export const BULK_MAX_KG = 10_000;

export function isFuelId(value: unknown): value is FuelId {
  return value === "uhlie" || value === "antracit" || value === "koks";
}

/**
 * Sample prices including VAT. Edit here — the shop reads this file only.
 * Solo prices already include packing and SDS courier delivery.
 * Bulk prices are goods + packing; pallet freight is estimated separately.
 */
export const FUELS: Record<FuelId, Fuel> = {
  uhlie: {
    id: "uhlie",
    name: "Kováčske uhlie",
    shortName: "Uhlie",
    adjective: "kováčskeho uhlia",
    bagKg: 25,
    palletBags: 40,
    soloMaxBags: 3,
    soloPrice: 28.9,
    bulkPresetsKg: [100, 250, 500, 1000],
    bulkMinKg: 100,
    bulkStepKg: 100,
    tiers: [
      { minKg: 100, pricePerKg: 0.89, label: "100 kg" },
      { minKg: 250, pricePerKg: 0.82, label: "250 kg" },
      { minKg: 500, pricePerKg: 0.75, label: "500 kg" },
      { minKg: 1000, pricePerKg: 0.68, label: "1 t / paleta" },
    ],
    color: "#2b2a28",
    grain: "#3f3c38",
    summary:
      "Klasické čierne uhlie do vyhne. Silný žiar, o čosi viac dymu ako koks — obľúbené u hobby kováčov a nožiarov.",
    use: "Vyhňa, nožiarstvo, ukážkové kúrenie.",
  },
  antracit: {
    id: "antracit",
    name: "Kováčsky antracit",
    shortName: "Antracit",
    adjective: "kováčskeho antracitu",
    bagKg: 25,
    palletBags: 40,
    soloMaxBags: 3,
    soloPrice: 34.9,
    bulkPresetsKg: [100, 250, 500, 1000],
    bulkMinKg: 100,
    bulkStepKg: 100,
    tiers: [
      { minKg: 100, pricePerKg: 1.12, label: "100 kg" },
      { minKg: 250, pricePerKg: 1.04, label: "250 kg" },
      { minKg: 500, pricePerKg: 0.96, label: "500 kg" },
      { minKg: 1000, pricePerKg: 0.88, label: "1 t / paleta" },
    ],
    color: "#12141a",
    grain: "#2a3140",
    summary:
      "Tvrdý antracit s dlhým horením a nízkym dymom. Na dlhšiu prácu vo vyhni, keď treba stály žiar.",
    use: "Dlhá práca vo vyhni, čistejšie horenie.",
  },
  koks: {
    id: "koks",
    name: "Kováčsky koks",
    shortName: "Koks",
    adjective: "kováčskeho koksu",
    bagKg: 20,
    palletBags: 50,
    soloMaxBags: 4,
    soloPrice: 32.9,
    bulkPresetsKg: [100, 200, 500, 1000],
    bulkMinKg: 100,
    bulkStepKg: 100,
    tiers: [
      { minKg: 100, pricePerKg: 1.25, label: "100 kg" },
      { minKg: 200, pricePerKg: 1.15, label: "200 kg" },
      { minKg: 500, pricePerKg: 1.05, label: "500 kg" },
      { minKg: 1000, pricePerKg: 0.95, label: "1 t / paleta" },
    ],
    color: "#5c5852",
    grain: "#8a8378",
    summary:
      "Koks do vyhne: vysoká teplota, málo dymu. Vrecia po 20 kg — na paletu 110 × 120 cm ide 50 vriec, teda jedna tona.",
    use: "Kovanie, nožiarstvo, vysoký žiar.",
  },
};

export const PRODUCTS: CatalogProduct[] = [
  {
    id: "uhlie-solo",
    slug: "uhlie-25kg",
    channel: "solo",
    fuelId: "uhlie",
    name: "Kováčske uhlie 25 kg",
    eyebrow: "Solo vrece · kuriér SDS",
    lead: "Jedno 25 kg vrece s doručením. Cena už zahŕňa balné aj kuriéra.",
  },
  {
    id: "antracit-solo",
    slug: "antracit-25kg",
    channel: "solo",
    fuelId: "antracit",
    name: "Kováčsky antracit 25 kg",
    eyebrow: "Solo vrece · kuriér SDS",
    lead: "Jedno 25 kg vrece s doručením. Vhodné ako vzorka alebo pre hobby vyhňu.",
  },
  {
    id: "koks-solo",
    slug: "koks-20kg",
    channel: "solo",
    fuelId: "koks",
    name: "Kováčsky koks 20 kg",
    eyebrow: "Solo vrece · kuriér SDS",
    lead: "Jedno 20 kg vrece s doručením. Kuriér unesie najviac štyri vrecia koksu.",
  },
  {
    id: "uhlie-bulk",
    slug: "uhlie",
    channel: "bulk",
    fuelId: "uhlie",
    name: "Kováčske uhlie od 100 kg",
    eyebrow: "Na objednávku · 25 kg vrecia",
    lead: "Tovar na objednávku, nie do košíka. Od 100 kg (4 vrecia). Čím viac kíl, tým nižšia cena za kilogram.",
  },
  {
    id: "antracit-bulk",
    slug: "antracit",
    channel: "bulk",
    fuelId: "antracit",
    name: "Kováčsky antracit od 100 kg",
    eyebrow: "Na objednávku · 25 kg vrecia",
    lead: "Tovar na objednávku, nie do košíka. Od 100 kg (4 vrecia). Plná paleta je 40 vriec, teda 1 000 kg.",
  },
  {
    id: "koks-bulk",
    slug: "koks",
    channel: "bulk",
    fuelId: "koks",
    name: "Kováčsky koks od 100 kg",
    eyebrow: "Na objednávku · 20 kg vrecia",
    lead: "Tovar na objednávku, nie do košíka. Od 100 kg (5 vriec). Plná paleta je 50 vriec, teda 1 000 kg.",
  },
];

export function getFuel(id: FuelId) {
  return FUELS[id];
}

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return PRODUCTS.find((product) => product.id === id);
}

export function palletKg(fuel: Fuel) {
  return fuel.bagKg * fuel.palletBags;
}

export function bagsForKg(bagKg: number, kg: number) {
  return kg / bagKg;
}

export function kgForBags(bagKg: number, bags: number) {
  return bagKg * bags;
}

export function isWholeBags(bagKg: number, kg: number) {
  return kg > 0 && kg % bagKg === 0;
}

export const SOLO_PRODUCTS = PRODUCTS.filter((product) => product.channel === "solo");
export const BULK_PRODUCTS = PRODUCTS.filter((product) => product.channel === "bulk");
