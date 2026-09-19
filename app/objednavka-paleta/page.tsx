import { PalletOrderScreen } from "@/components/pallet-order-screen";

export const metadata = {
  title: "Paletová objednávka",
  description:
    "Záväzná objednávka kováčskeho uhlia, antracitu a koksu od 100 kg. Nie e-shopový košík.",
};

export default function PalletOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ palivo?: string; kg?: string }>;
}) {
  return <PalletOrderScreen searchParams={searchParams} />;
}
