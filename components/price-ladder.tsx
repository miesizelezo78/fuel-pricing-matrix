import { cn } from "cn";
import type { Fuel } from "@/lib/catalog";
import { packingFor } from "@/lib/catalog";
import { formatMoney, formatPerKg } from "@/lib/format";
import { bulkGoodsPrice } from "@/lib/pricing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PriceLadder({
  fuel,
  selectedKg,
}: {
  fuel: Fuel;
  selectedKg: number;
}) {
  const first = fuel.tiers[0];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Zostava</TableHead>
          <TableHead>Vrecia</TableHead>
          <TableHead>€ / kg</TableHead>
          <TableHead className="text-right">Tovar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fuel.tiers.map((tier) => {
          const kg = tier.minKg;
          const bags = kg / fuel.bagKg;
          const priced = bulkGoodsPrice(fuel, kg);
          const packing = packingFor(fuel, kg);
          const active =
            selectedKg >= fuel.bulkMinKg &&
            selectedKg >= tier.minKg &&
            selectedKg < nextMin(fuel, tier.minKg);
          const perKgSave = first.pricePerKg - priced.pricePerKg;
          return (
            <TableRow
              key={tier.minKg}
              className={cn(active && "bg-primary/8 font-medium")}
            >
              <TableCell>
                {tier.label}
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  {packing.ladderLabel}
                </span>
                <span className="block text-xs font-normal tabular-nums text-muted-foreground">
                  {packing.fraction}
                </span>
              </TableCell>
              <TableCell>
                {bags} × {fuel.bagKg} kg
              </TableCell>
              <TableCell>
                {formatPerKg(priced.pricePerKg)}
                {perKgSave > 0 ? (
                  <span className="mt-0.5 block text-xs font-semibold text-primary">
                    −{formatMoney(perKgSave)}/kg
                  </span>
                ) : null}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(priced.goods)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function nextMin(fuel: Fuel, minKg: number) {
  const next = fuel.tiers.find((tier) => tier.minKg > minKg);
  return next?.minKg ?? Infinity;
}

export function PalletMeter({ fuel, kg }: { fuel: Fuel; kg: number }) {
  const packing = packingFor(fuel, Math.max(0, kg));

  return (
    <div className="rounded-xl bg-muted/70 p-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>{packing.title}</span>
        <span className="shrink-0 tabular-nums">{packing.fraction}</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-background ring-1 ring-foreground/10">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${Math.min(100, packing.fill * 100)}%` }}
        />
      </div>
      {kg < fuel.bulkMinKg ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Paletový predaj začína od 100 kg na palete 80 × 120 cm.
          Paleta je jednorazová, nevratná a v cene tovaru.
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">{packing.note}</p>
      )}
    </div>
  );
}
