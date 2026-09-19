import {
  VAT_RATE,
  type FuelId,
  getFuel,
  getProduct,
  isFuelId,
} from "@/lib/catalog";
import { roundMoney } from "@/lib/format";
import { bulkKgError, quoteBulk } from "@/lib/pricing";

export type BuyerType = "person" | "company";
export type Fulfillment = "pickup" | "pallet";

export type PalletOrderInput = {
  fuelId: FuelId;
  kg: number;
  fulfillment: Fulfillment;
  buyerType: BuyerType;
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  ico?: string;
  dic?: string;
  icDph?: string;
  note?: string;
  binding: boolean;
};

export type PalletOrderResult = {
  ok: true;
  orderId: string;
  mocked: boolean;
  documentId?: number;
  token?: string;
  goods: number;
  kg: number;
  bags: number;
  fuelName: string;
  fulfillment: Fulfillment;
  message: string;
};

export type PalletOrderError = {
  ok: false;
  error: string;
};

const FUEL_SLUG: Record<FuelId, string> = {
  uhlie: "uhlie",
  antracit: "antracit",
  koks: "koks",
};

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function readPalletOrder(raw: unknown): PalletOrderInput {
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    fuelId: body.fuelId as FuelId,
    kg: typeof body.kg === "number" ? body.kg : Number.NaN,
    fulfillment: body.fulfillment as Fulfillment,
    buyerType: body.buyerType as BuyerType,
    name: asText(body.name),
    email: asText(body.email),
    phone: asText(body.phone),
    street: asText(body.street),
    city: asText(body.city),
    zip: asText(body.zip),
    ico: asText(body.ico) || undefined,
    dic: asText(body.dic) || undefined,
    icDph: asText(body.icDph) || undefined,
    note: asText(body.note) || undefined,
    binding: body.binding === true,
  };
}

export function validatePalletOrder(input: PalletOrderInput) {
  const errors: Partial<Record<keyof PalletOrderInput, string>> = {};
  if (!input.binding) {
    errors.binding = "Potvrďte, že ide o záväznú objednávku.";
  }
  if (input.fulfillment !== "pickup" && input.fulfillment !== "pallet") {
    errors.fulfillment = "Zvoľte osobný odber alebo paletovú prepravu.";
  }
  if (input.buyerType !== "person" && input.buyerType !== "company") {
    errors.buyerType = "Zvoľte fyzickú osobu alebo firmu.";
  }
  if (input.name.trim().length < 3) errors.name = "Zadajte meno / názov firmy.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = "Zadajte platný e-mail.";
  }
  if (input.phone.replace(/\s/g, "").length < 9) errors.phone = "Zadajte telefón.";
  if (input.street.trim().length < 4) errors.street = "Zadajte ulicu a číslo.";
  if (input.city.trim().length < 2) errors.city = "Zadajte mesto.";
  if (!/^\d{3}\s?\d{2}$/.test(input.zip.trim())) errors.zip = "PSČ v tvare 000 00.";
  if (input.buyerType === "company") {
    const ico = (input.ico ?? "").replace(/\s/g, "");
    if (ico.length < 6) errors.ico = "Zadajte IČO.";
  }
  if (!isFuelId(input.fuelId)) {
    errors.fuelId = "Neznáme palivo.";
  } else {
    const product = getProduct(FUEL_SLUG[input.fuelId]);
    if (!product || product.channel !== "bulk") {
      errors.fuelId = "Neznáme palivo.";
    }
    const kgError = bulkKgError(getFuel(input.fuelId), input.kg);
    if (kgError) errors.kg = kgError;
  }
  return errors;
}

export function netFromGross(gross: number, vatPercent = VAT_RATE) {
  return roundMoney(gross / (1 + vatPercent / 100));
}

export function buildSuperfakturaPayload(input: PalletOrderInput) {
  const product = getProduct(FUEL_SLUG[input.fuelId]);
  if (!product) throw new Error("Neznáme palivo");
  const quote = quoteBulk(product, input.kg);
  const fuel = getFuel(input.fuelId);
  const orderId = `PAL-${Date.now().toString().slice(-8)}`;
  const fulfillmentLabel =
    input.fulfillment === "pickup"
      ? "Osobný odber. Paletovú dopravu neúčtujeme."
      : "Paletová preprava. Dopravu naceníme zvlášť a doplníme do dokladu.";

  const client = {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    address: input.street.trim(),
    city: input.city.trim(),
    zip: input.zip.trim(),
    country_id: 191,
    ico: input.ico?.replace(/\s/g, "") || undefined,
    dic: input.dic?.replace(/\s/g, "") || undefined,
    ic_dph: input.icDph?.replace(/\s/g, "") || undefined,
    update_addressbook: 1,
    comment: input.note?.trim() || undefined,
  };

  const invoice = {
    name: `Záväzná objednávka ${fuel.name}`,
    type: "order",
    order_no: orderId,
    invoice_currency: "EUR",
    header_comment: `Záväzná paletová objednávka, nie e-shopový košík. ${fulfillmentLabel}`,
    internal_comment: `kg=${quote.kg}; bags=${quote.bags}; fulfillment=${input.fulfillment}`,
    delivery_name: input.name.trim(),
    delivery_address: input.street.trim(),
    delivery_city: input.city.trim(),
    delivery_zip: input.zip.trim(),
    delivery_phone: input.phone.trim(),
  };

  const items = [
    {
      name: fuel.name,
      description: `${quote.bags} × ${fuel.bagKg} kg vrecia · paleta 110 × 120 cm · ${quote.tier.label}`,
      quantity: quote.kg,
      unit: "kg",
      unit_price: netFromGross(quote.pricePerKg),
      tax: VAT_RATE,
    },
  ];

  return {
    orderId,
    quote,
    fuel,
    payload: {
      Invoice: invoice,
      InvoiceItem: items,
      Client: client,
    },
  };
}

export async function createSuperfakturaOrder(input: PalletOrderInput): Promise<
  PalletOrderResult | PalletOrderError
> {
  const errors = validatePalletOrder(input);
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: Object.values(errors)[0] ?? "Neplatná objednávka." };
  }

  const built = buildSuperfakturaPayload(input);
  if (built.quote.kg !== input.kg) {
    return { ok: false, error: "Hmotnosť sa nepodarilo overiť." };
  }
  const email = process.env.SUPERFAKTURA_EMAIL;
  const apiKey = process.env.SUPERFAKTURA_API_KEY;
  const companyId = process.env.SUPERFAKTURA_COMPANY_ID ?? "";
  const baseUrl = (
    process.env.SUPERFAKTURA_BASE_URL ?? "https://moja.superfaktura.sk"
  ).replace(/\/$/, "");

  if (!email || !apiKey) {
    return {
      ok: true,
      mocked: true,
      orderId: built.orderId,
      goods: built.quote.goods,
      kg: built.quote.kg,
      bags: built.quote.bags,
      fuelName: built.fuel.name,
      fulfillment: input.fulfillment,
      message:
        "Kľúče SuperFaktúry nie sú nastavené. Objednávka je uložená ako náhľad. Doplňte SUPERFAKTURA_EMAIL a SUPERFAKTURA_API_KEY.",
    };
  }

  const body = new URLSearchParams();
  body.set("data", JSON.stringify(built.payload));

  const response = await fetch(`${baseUrl}/invoices/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Authorization: `SFAPI email=${encodeURIComponent(email)}&apikey=${encodeURIComponent(apiKey)}&company_id=${encodeURIComponent(companyId)}`,
    },
    body,
  });

  const json = (await response.json().catch(() => null)) as
    | {
        error?: number | string;
        error_message?: string;
        data?: { Invoice?: { id?: number; token?: string; order_no?: string } };
      }
    | null;

  if (!response.ok || json?.error) {
    return {
      ok: false,
      error:
        json?.error_message ||
        `SuperFaktúra vrátila chybu (${response.status}). Skontrolujte typ dokladu order a API kľúč.`,
    };
  }

  return {
    ok: true,
    mocked: false,
    orderId: json?.data?.Invoice?.order_no || built.orderId,
    documentId: json?.data?.Invoice?.id,
    token: json?.data?.Invoice?.token,
    goods: built.quote.goods,
    kg: built.quote.kg,
    bags: built.quote.bags,
    fuelName: built.fuel.name,
    fulfillment: input.fulfillment,
    message: "Objednávka odišla do SuperFaktúry. Ostrý doklad príde odtiaľ.",
  };
}
