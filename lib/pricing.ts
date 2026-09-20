import {
  BULK_MAX_KG,
  COD_FEE_EUR,
  type CatalogProduct,
  type Fuel,
  type PriceTier,
  getFuel,
  getProduct,
  getProductById,
  palletKg,
} from "@/lib/catalog";
import { formatBagCount, roundMoney } from "@/lib/format";

export type PaymentMethod = "transfer" | "cod";

export function tierForKg(tiers: PriceTier[], kg: number): PriceTier {
  const sorted = [...tiers].sort((a, b) => a.minKg - b.minKg);
  let current = sorted[0];
  for (const tier of sorted) {
    if (kg >= tier.minKg) current = tier;
  }
  return current;
}

/** Whole-bag kilogram values from 100 kg up, one bag at a time. */
export function bulkKgOptions(fuel: Fuel): number[] {
  const values: number[] = [];
  for (let kg = fuel.bulkMinKg; kg <= BULK_MAX_KG; kg += fuel.bagKg) {
    if (kg % fuel.bagKg === 0) values.push(kg);
  }
  return values;
}

export function isValidBulkKg(fuel: Fuel, kg: number) {
  return Number.isInteger(kg) && bulkKgOptions(fuel).includes(kg);
}

export function bulkKgError(fuel: Fuel, kg: number) {
  if (!Number.isFinite(kg) || !Number.isInteger(kg)) {
    return "Zadajte hmotnosť v celých kilogramoch.";
  }
  if (kg < fuel.bulkMinKg) {
    return "Paletová objednávka začína od 100 kg.";
  }
  if (kg > BULK_MAX_KG) {
    return "Najviac 10 000 kg v jednej objednávke.";
  }
  if (kg % fuel.bagKg !== 0) {
    return `Hmotnosť musí sedieť na celé ${fuel.bagKg} kg vrecia.`;
  }
  if (!isValidBulkKg(fuel, kg)) {
    return `Hmotnosť ide po jednom ${fuel.bagKg} kg vreci, od 100 kg.`;
  }
  return undefined;
}

export function clampBulkKg(fuel: Fuel, kg: number, allowZero = false) {
  if (allowZero && (!Number.isFinite(kg) || kg <= 0)) return 0;
  const options = bulkKgOptions(fuel);
  const fallback = options[0] ?? fuel.bulkMinKg;
  if (!Number.isFinite(kg)) return fallback;
  let best = fallback;
  let bestDist = Math.abs(kg - best);
  for (const option of options) {
    const dist = Math.abs(kg - option);
    if (dist < bestDist) {
      best = option;
      bestDist = dist;
    }
  }
  return best;
}

export function clampSoloBags(fuel: Fuel, bags: number) {
  return Math.min(fuel.soloMaxBags, Math.max(1, Math.round(bags)));
}

/**
 * Pallet freight estimate for Slovakia. Replace with a real tariff
 * (region, tail-lift, crane) before going live.
 */
export function freightForBulkKg(kg: number) {
  if (kg <= 0) return 0;
  const pallets = Math.max(1, Math.ceil(kg / 1000));
  let perPallet = 89;
  if (kg < 250) perPallet = 39;
  else if (kg < 500) perPallet = 55;
  else if (kg < 1000) perPallet = 72;
  return roundMoney(perPallet * pallets);
}

export function bulkGoodsPrice(fuel: Fuel, kg: number) {
  const tier = tierForKg(fuel.tiers, kg);
  return {
    tier,
    pricePerKg: tier.pricePerKg,
    goods: roundMoney(kg * tier.pricePerKg),
  };
}

export function savingsVsFirstTier(fuel: Fuel, kg: number) {
  const first = [...fuel.tiers].sort((a, b) => a.minKg - b.minKg)[0];
  const current = bulkGoodsPrice(fuel, kg);
  return roundMoney(kg * first.pricePerKg - current.goods);
}

export function palletFill(fuel: Fuel, kg: number) {
  return kg / palletKg(fuel);
}

export function quoteSolo(product: CatalogProduct, bags: number) {
  const fuel = getFuel(product.fuelId);
  const qty = clampSoloBags(fuel, bags);
  const kg = qty * fuel.bagKg;
  const goods = roundMoney(qty * fuel.soloPrice);
  return {
    product,
    fuel,
    bags: qty,
    kg,
    goods,
    freight: 0,
    fulfillment: "courier" as const,
    pricePerBag: fuel.soloPrice,
    maxBags: fuel.soloMaxBags,
  };
}

export type BulkLineInput = {
  fuelId: Fuel["id"];
  kg: number;
};

export function quoteBulkLines(
  lines: BulkLineInput[],
  fulfillment: "pickup" | "pallet" = "pallet",
) {
  const priced = lines
    .filter((line) => line.kg >= 100)
    .map((line) => {
      const product = getProduct(line.fuelId);
      if (!product || product.channel !== "bulk") {
        throw new Error(`Neznáme palivo ${line.fuelId}`);
      }
      return quoteBulk(product, line.kg);
    });
  const goods = roundMoney(priced.reduce((sum, line) => sum + line.goods, 0));
  const kg = priced.reduce((sum, line) => sum + line.kg, 0);
  const bags = priced.reduce((sum, line) => sum + line.bags, 0);
  const savings = roundMoney(
    priced.reduce((sum, line) => sum + line.savings, 0),
  );
  const freight = fulfillment === "pickup" ? 0 : freightForBulkKg(kg);
  return {
    lines: priced,
    goods,
    kg,
    bags,
    savings,
    freight,
    total: roundMoney(goods + freight),
    fulfillment,
  };
}

export function quoteBulk(product: CatalogProduct, kgInput: number) {
  const fuel = getFuel(product.fuelId);
  const kg = clampBulkKg(fuel, kgInput);
  const bags = kg / fuel.bagKg;
  const priced = bulkGoodsPrice(fuel, kg);
  return {
    product,
    fuel,
    bags,
    kg,
    goods: priced.goods,
    freight: freightForBulkKg(kg),
    fulfillment: "freight" as const,
    tier: priced.tier,
    pricePerKg: priced.pricePerKg,
    savings: savingsVsFirstTier(fuel, kg),
    palletFill: palletFill(fuel, kg),
  };
}

export type CartLine = {
  productId: string;
  bags: number;
};

export type CartState = {
  lines: CartLine[];
  payment: PaymentMethod;
};

export type PricedLine = {
  product: CatalogProduct;
  fuel: Fuel;
  bags: number;
  kg: number;
  goods: number;
  fulfillment: "courier" | "freight";
  unitLabel: string;
  detail: string;
};

export function priceCart(cart: CartState) {
  const pricedLines: PricedLine[] = [];
  let bulkKg = 0;
  let goods = 0;
  let hasCourier = false;
  let hasFreight = false;

  for (const line of cart.lines) {
    const product = requireProduct(line.productId);
    const fuel = getFuel(product.fuelId);

    if (product.channel === "solo") {
      const quote = quoteSolo(product, line.bags);
      hasCourier = true;
      goods = roundMoney(goods + quote.goods);
      pricedLines.push({
        product,
        fuel,
        bags: quote.bags,
        kg: quote.kg,
        goods: quote.goods,
        fulfillment: "courier",
        unitLabel: `${quote.bags} × ${fuel.bagKg} kg`,
        detail: "Doručenie kuriérom SDS je v cene.",
      });
    } else {
      const kg = line.bags * fuel.bagKg;
      const quote = quoteBulk(product, kg);
      hasFreight = true;
      bulkKg += quote.kg;
      goods = roundMoney(goods + quote.goods);
      pricedLines.push({
        product,
        fuel,
        bags: quote.bags,
        kg: quote.kg,
        goods: quote.goods,
        fulfillment: "freight",
        unitLabel: `${formatBagCount(quote.bags)} · ${quote.kg} kg`,
        detail: `${quote.tier.label} · ${quote.pricePerKg.toFixed(2).replace(".", ",")} €/kg`,
      });
    }
  }

  const freight = hasFreight ? freightForBulkKg(bulkKg) : 0;
  const cod = cart.payment === "cod" && pricedLines.length > 0 ? COD_FEE_EUR : 0;
  const total = roundMoney(goods + freight + cod);

  return {
    pricedLines,
    goods,
    freight,
    cod,
    total,
    bulkKg,
    hasCourier,
    hasFreight,
    itemCount: pricedLines.reduce((sum, line) => sum + line.bags, 0),
  };
}

function requireProduct(id: string) {
  const product = getProductById(id);
  if (!product) {
    throw new Error(`Unknown product ${id}`);
  }
  return product;
}
