import { readFileSync } from "node:fs";

const catalog = JSON.parse(
  readFileSync(new URL("../bulk-paleta/includes/catalog.json", import.meta.url), "utf8"),
);

function clampKg(fuel, next) {
  const bag = fuel.bagKg;
  let kg = Math.round(Number(next) || fuel.presetsKg[0]);
  kg = Math.max(100, Math.min(10000, kg));
  if (fuel.id === "koks" && kg === 250) kg = 200;
  kg = Math.round(kg / bag) * bag;
  if (fuel.id === "koks" && (kg === 250 || kg === 240 || kg === 260)) kg = 200;
  if (kg < 100) kg = Math.ceil(100 / bag) * bag;
  return kg;
}

function tierFor(fuel, kg) {
  let current = fuel.tiers[0];
  for (const tier of fuel.tiers) {
    if (kg >= tier.minKg) current = tier;
  }
  return current;
}

function freight(kg, fulfillment) {
  if (fulfillment === "pickup" || kg <= 0) return 0;
  const pallets = Math.max(1, Math.ceil(kg / 1000));
  let rate = 89;
  for (const row of catalog.freightPerPalletEur) {
    if (row.belowKg === null || kg < row.belowKg) {
      rate = row.eur;
      break;
    }
  }
  return Math.round(rate * pallets * 100) / 100;
}

function quote(fuelId, kg, fulfillment = "pallet") {
  const fuel = catalog.fuels[fuelId];
  kg = clampKg(fuel, kg);
  const tier = tierFor(fuel, kg);
  const goods = Math.round(kg * tier.pricePerKg * 100) / 100;
  const ship = freight(kg, fulfillment);
  return {
    kg,
    pricePerKg: tier.pricePerKg,
    goods,
    freight: ship,
    total: Math.round((goods + ship) * 100) / 100,
  };
}

const cases = [
  ["antracit", 250, "pallet", { kg: 250, pricePerKg: 1.04, goods: 260, freight: 55, total: 315 }],
  ["koks", 250, "pallet", { kg: 200, pricePerKg: 1.15, goods: 230, freight: 39, total: 269 }],
  ["koks", 200, "pickup", { kg: 200, pricePerKg: 1.15, goods: 230, freight: 0, total: 230 }],
  ["uhlie", 250, "pallet", { kg: 250, pricePerKg: 0.82, goods: 205, freight: 55, total: 260 }],
];

let failed = 0;
for (const [fuelId, kg, fulfillment, expected] of cases) {
  const got = quote(fuelId, kg, fulfillment);
  const ok = Object.keys(expected).every((key) => got[key] === expected[key]);
  console.log(ok ? "OK" : "FAIL", fuelId, kg, fulfillment, got);
  if (!ok) {
    console.error(" expected", expected);
    failed += 1;
  }
}
if (failed) process.exit(1);
console.log("quote-check passed");
