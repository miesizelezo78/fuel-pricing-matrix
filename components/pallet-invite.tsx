import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BagMark } from "@/components/bag-mark";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFuel, type FuelId } from "@/lib/catalog";
import { formatPerKg } from "@/lib/format";
import { palletOrderHref } from "@/lib/paths";
import { bulkGoodsPrice } from "@/lib/pricing";

export function PalletInvite({ fuelId }: { fuelId: FuelId }) {
  const fuel = getFuel(fuelId);
  const pallet = bulkGoodsPrice(fuel, fuel.bagKg * fuel.palletBags);

  return (
    <Link
      href={palletOrderHref(fuelId)}
      className="group mt-6 block"
    >
      <Card className="transition-[transform,box-shadow] group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <CardContent className="flex items-center gap-4 pb-4 sm:gap-5">
          <div className="h-20 w-16 shrink-0 sm:h-24 sm:w-20">
            <BagMark fuelId={fuel.id} weight={fuel.bagKg} />
          </div>
          <div className="min-w-0 flex-1">
            <Badge>Na objednávku</Badge>
            <p className="font-heading mt-2 text-xl leading-tight sm:text-2xl">
              {fuel.shortName} od 100 kg
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Toto vrece s kuriérom je e-shop. Od 100 kg je to tovar na
              objednávku — konfigurátor, paleta, nie košík.
            </p>
            <p className="mt-2 text-sm font-medium">
              {formatPerKg(pallet.pricePerKg)} na plnej palete
              <span className="sm:hidden"> · K objednávke</span>
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1 text-sm font-medium sm:inline-flex">
            K objednávke
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
