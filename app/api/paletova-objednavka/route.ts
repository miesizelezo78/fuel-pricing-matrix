import { createSuperfakturaOrder, readPalletOrder } from "@/lib/superfaktura";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Neplatné JSON." }, { status: 400 });
  }

  try {
    const result = await createSuperfakturaOrder(readPalletOrder(raw));
    return Response.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Objednávku sa nepodarilo odoslať.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
