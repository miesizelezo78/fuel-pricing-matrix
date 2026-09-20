import {
  VAT_RATE,
  type FuelId,
  getFuel,
  getProduct,
  isFuelId,
} from "@/lib/catalog";
import { roundMoney } from "@/lib/format";
import { bulkKgError, quoteBulkLines } from "@/lib/pricing";

export type BuyerType = "person" | "company";
export type Fulfillment = "pickup" | "pallet";

export type PalletOrderLineInput = {
  fuelId: FuelId;
  kg: number;
};

export type PalletOrderInput = {
  lines: PalletOrderLineInput[];
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
  lines: {
    fuelId: FuelId;
    fuelName: string;
    kg: number;
    bags: number;
    goods: number;
    pricePerKg: number;
  }[];
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

function readLines(body: Record<string, unknown>): PalletOrderLineInput[] {
  const raw = body.lines;
  if (typeof raw === "string") {
    try {
      return readLines({ ...body, lines: JSON.parse(raw) });
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        const fuelId = row.fuelId;
        const kg = typeof row.kg === "number" ? row.kg : Number(row.kg);
        if (!isFuelId(fuelId) || !Number.isFinite(kg) || kg <= 0) return null;
        return { fuelId, kg };
      })
      .filter((line): line is PalletOrderLineInput => line !== null);
  }
  if (isFuelId(body.fuelId)) {
    const kg = typeof body.kg === "number" ? body.kg : Number(body.kg);
    if (Number.isFinite(kg) && kg > 0) return [{ fuelId: body.fuelId, kg }];
  }
  return [];
}

export function readPalletOrder(raw: unknown): PalletOrderInput {
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    lines: readLines(body),
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
    binding: body.binding === true || body.binding === "true" || body.binding === "on",
  };
}

export function validatePalletOrder(input: PalletOrderInput) {
  const errors: Partial<Record<keyof PalletOrderInput | "kg" | "fuelId", string>> = {};
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
  if (input.lines.length === 0) {
    errors.fuelId = "Vyberte aspoň jedno palivo od 100 kg.";
  } else {
    for (const line of input.lines) {
      if (!isFuelId(line.fuelId)) {
        errors.fuelId = "Neznáme palivo.";
        break;
      }
      const product = getProduct(FUEL_SLUG[line.fuelId]);
      if (!product || product.channel !== "bulk") {
        errors.fuelId = "Neznáme palivo.";
        break;
      }
      const kgError = bulkKgError(getFuel(line.fuelId), line.kg);
      if (kgError) {
        errors.kg = kgError;
        break;
      }
    }
  }
  return errors;
}

export function netFromGross(gross: number, vatPercent = VAT_RATE) {
  return roundMoney(gross / (1 + vatPercent / 100));
}

export function buildSuperfakturaPayload(input: PalletOrderInput) {
  const quote = quoteBulkLines(input.lines, input.fulfillment);
  const names = quote.lines.map((line) => line.fuel.name).join(" + ");
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
    name: `Záväzná objednávka ${names}`,
    type: "order",
    order_no: orderId,
    invoice_currency: "EUR",
    header_comment: `Záväzná paletová objednávka, nie e-shopový košík. Každé palivo má vlastnú sadzbu z vlastných kíl. ${fulfillmentLabel}`,
    internal_comment: quote.lines
      .map((line) => `${line.fuel.id}=${line.kg}kg/${line.bags}v`)
      .concat(`fulfillment=${input.fulfillment}`)
      .join("; "),
    delivery_name: input.name.trim(),
    delivery_address: input.street.trim(),
    delivery_city: input.city.trim(),
    delivery_zip: input.zip.trim(),
    delivery_phone: input.phone.trim(),
  };

  const items = quote.lines.map((line) => ({
    name: line.fuel.name,
    description: `${line.bags} × ${line.fuel.bagKg} kg vrecia · paleta 110 × 120 cm · ${line.tier.label}`,
    quantity: line.kg,
    unit: "kg",
    unit_price: netFromGross(line.pricePerKg),
    tax: VAT_RATE,
  }));

  return {
    orderId,
    quote,
    names,
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
  const email = process.env.SUPERFAKTURA_EMAIL;
  const apiKey = process.env.SUPERFAKTURA_API_KEY;
  const companyId = process.env.SUPERFAKTURA_COMPANY_ID ?? "";
  const baseUrl = (
    process.env.SUPERFAKTURA_BASE_URL ?? "https://moja.superfaktura.sk"
  ).replace(/\/$/, "");

  const lines = built.quote.lines.map((line) => ({
    fuelId: line.fuel.id,
    fuelName: line.fuel.name,
    kg: line.kg,
    bags: line.bags,
    goods: line.goods,
    pricePerKg: line.pricePerKg,
  }));

  if (!email || !apiKey) {
    return {
      ok: true,
      mocked: true,
      orderId: built.orderId,
      goods: built.quote.goods,
      kg: built.quote.kg,
      bags: built.quote.bags,
      fuelName: built.names,
      fulfillment: input.fulfillment,
      lines,
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
    fuelName: built.names,
    fulfillment: input.fulfillment,
    lines,
    message: "Objednávka odišla do SuperFaktúry. Ostrý doklad príde odtiaľ.",
  };
}
