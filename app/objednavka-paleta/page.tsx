import { PalletOrderScreen } from "@/components/pallet-order-screen";

export const metadata = {
  title: "Kováčske palivá od 100 kg",
  description:
    "Záväzná paletová objednávka kováčskeho uhlia, antracitu a koksu od 100 kg. Nie e-shopový košík. Paleta je v cene tovaru.",
};

export default function PalletOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ palivo?: string; kg?: string }>;
}) {
  return <PalletOrderScreen searchParams={searchParams} />;
}
