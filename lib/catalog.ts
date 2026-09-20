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

/** 100 kg and 200 kg pack on a EUR pallet. */
export const EURO_PALLET = {
  widthCm: 80,
  depthCm: 120,
  maxKg: 200,
} as const;

/** Larger lots go on 110 × 120 cm; 110 × 110 cm happens too. */
export const INDUSTRIAL_PALLET = {
  widthCm: 110,
  depthCm: 120,
  altWidthCm: 110,
  altDepthCm: 110,
} as const;

export const PALLET_CM = {
  width: INDUSTRIAL_PALLET.widthCm,
  depth: INDUSTRIAL_PALLET.depthCm,
} as const;

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
    bulkPresetsKg: [100, 250, 500, 750, 1000],
    bulkMinKg: 100,
    bulkStepKg: 25,
    tiers: [
      { minKg: 100, pricePerKg: 0.89, label: "100 kg" },
      { minKg: 250, pricePerKg: 0.82, label: "250 kg" },
      { minKg: 500, pricePerKg: 0.75, label: "500 kg" },
      { minKg: 1000, pricePerKg: 0.68, label: "1 000 kg" },
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
    bulkPresetsKg: [100, 250, 500, 750, 1000],
    bulkMinKg: 100,
    bulkStepKg: 25,
    tiers: [
      { minKg: 100, pricePerKg: 1.12, label: "100 kg" },
      { minKg: 250, pricePerKg: 1.04, label: "250 kg" },
      { minKg: 500, pricePerKg: 0.96, label: "500 kg" },
      { minKg: 1000, pricePerKg: 0.88, label: "1 000 kg" },
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
    bulkPresetsKg: [100, 200, 500, 800, 1000],
    bulkMinKg: 100,
    bulkStepKg: 20,
    tiers: [
      { minKg: 100, pricePerKg: 1.25, label: "100 kg" },
      { minKg: 200, pricePerKg: 1.15, label: "200 kg" },
      { minKg: 500, pricePerKg: 1.05, label: "500 kg" },
      { minKg: 1000, pricePerKg: 0.95, label: "1 000 kg" },
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
    lead: "Jedno 20 kg vrece s doručením. Jedna kuriérska zásielka má najviac štyri vrecia koksu.",
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
    lead: "Tovar na objednávku, nie do košíka. Od 100 kg (4 vrecia). Čím viac kíl, tým nižšia cena za kilogram.",
  },
  {
    id: "koks-bulk",
    slug: "koks",
    channel: "bulk",
    fuelId: "koks",
    name: "Kováčsky koks od 100 kg",
    eyebrow: "Na objednávku · 20 kg vrecia",
    lead: "Tovar na objednávku, nie do košíka. Od 100 kg (5 vriec). Čím viac kíl, tým nižšia cena za kilogram.",
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

export function euroPalletBags(fuel: Fuel) {
  return EURO_PALLET.maxKg / fuel.bagKg;
}

export type PackingKind = "euro" | "industrial";

export type Packing = {
  kind: PackingKind;
  title: string;
  fraction: string;
  fill: number;
  bags: number;
  capBags: number;
  extraPallets: number;
  note: string;
  ladderLabel: string;
  invoiceLabel: string;
};

export const PALLET_DISPOSABLE =
  "Paleta je jednorazová, nevratná a v cene tovaru.";

export const PALLETS_DISPOSABLE =
  "Palety sú jednorazové, nevratné a v cene tovaru.";

export function packingSizeCm(kind: PackingKind) {
  if (kind === "euro") {
    return `${EURO_PALLET.widthCm} × ${EURO_PALLET.depthCm} cm`;
  }
  return `${INDUSTRIAL_PALLET.widthCm} × ${INDUSTRIAL_PALLET.depthCm} cm`;
}

export function packingFor(fuel: Fuel, kg: number): Packing {
  const bags = kg > 0 ? kg / fuel.bagKg : 0;
  if (kg <= EURO_PALLET.maxKg) {
    const cap = euroPalletBags(fuel);
    const size = packingSizeCm("euro");
    return {
      kind: "euro",
      title: `Paleta ${size}`,
      fraction: `${bags} / ${cap}`,
      fill: Math.min(1, bags / cap),
      bags,
      capBags: cap,
      extraPallets: 0,
      note: `100 kg a 200 kg idú na paletu ${size}. Väčšie množstvo na paletu ${packingSizeCm("industrial")}, niekedy ${INDUSTRIAL_PALLET.altWidthCm} × ${INDUSTRIAL_PALLET.altDepthCm} cm. ${PALLET_DISPOSABLE}`,
      ladderLabel: size,
      invoiceLabel: `paleta ${size}, jednorazová, nevratná, v cene`,
    };
  }
  const cap = fuel.palletBags;
  const extraPallets = bags > 0 ? Math.max(0, Math.ceil(bags / cap) - 1) : 0;
  const fill = cap > 0 ? bags / cap : 0;
  const size = packingSizeCm("industrial");
  const alt = `${INDUSTRIAL_PALLET.altWidthCm} × ${INDUSTRIAL_PALLET.altDepthCm} cm`;
  if (extraPallets > 0) {
    return {
      kind: "industrial",
      title: `${1 + extraPallets} palety ${size}`,
      fraction: `${bags} vriec`,
      fill: 1,
      bags,
      capBags: cap,
      extraPallets,
      note: `Nad jednu tonu ide ďalšia paleta ${size} (+${extraPallets}). Niekedy aj ${alt}. ${PALLETS_DISPOSABLE}`,
      ladderLabel: size,
      invoiceLabel: `paleta ${size}, jednorazová, nevratná, v cene`,
    };
  }
  return {
    kind: "industrial",
    title: `Paleta ${size}`,
    fraction: bags > 0 ? `${bags} / ${cap}` : `0 / ${cap}`,
    fill: Math.min(1, fill),
    bags,
    capBags: cap,
    extraPallets: 0,
    note: `Väčšie množstvá idú na paletu ${size}. Niekedy aj ${alt}. Jedna tona = ${cap} × ${fuel.bagKg} kg. ${PALLET_DISPOSABLE}`,
    ladderLabel: size,
    invoiceLabel: `paleta ${size}, jednorazová, nevratná, v cene`,
  };
}

export type ShipmentPacking = {
  kind: PackingKind;
  count: number;
  size: string;
  title: string;
  note: string;
};

function palletWord(count: number) {
  if (count === 1) return "paleta";
  if (count >= 2 && count <= 4) return "palety";
  return "paliet";
}

export function shipmentPacking(
  lines: { kg: number; shortName?: string }[],
): ShipmentPacking {
  const active = lines.filter((line) => line.kg >= 100);
  const kg = active.reduce((sum, line) => sum + line.kg, 0);
  if (kg <= 0) {
    return {
      kind: "euro",
      count: 0,
      size: packingSizeCm("euro"),
      title: "",
      note: "",
    };
  }
  if (kg <= EURO_PALLET.maxKg) {
    const size = packingSizeCm("euro");
    const names = active.map((line) => line.shortName).filter(Boolean);
    return {
      kind: "euro",
      count: 1,
      size,
      title: `1 paleta ${size}`,
      note:
        active.length > 1 && names.length > 1
          ? `${names.join(" a ")} idú spolu na jednej palete ${size}. ${PALLET_DISPOSABLE}`
          : `Paleta ${size}. ${PALLET_DISPOSABLE}`,
    };
  }
  const count = Math.max(1, Math.ceil(kg / 1000));
  const size = packingSizeCm("industrial");
  const disposable = count === 1 ? PALLET_DISPOSABLE : PALLETS_DISPOSABLE;
  return {
    kind: "industrial",
    count,
    size,
    title: `${count} ${palletWord(count)} ${size}`,
    note:
      count > 1
        ? `${count} ${palletWord(count)} ${size}. ${disposable} Niekedy aj ${INDUSTRIAL_PALLET.altWidthCm} × ${INDUSTRIAL_PALLET.altDepthCm} cm.`
        : `Paleta ${size}. ${disposable} Niekedy aj ${INDUSTRIAL_PALLET.altWidthCm} × ${INDUSTRIAL_PALLET.altDepthCm} cm.`,
  };
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
