import { cn } from "cn";
import type { FuelId } from "@/lib/catalog";

const tones: Record<FuelId, { fill: string; speck: string; stitch: string }> = {
  uhlie: { fill: "#2a2723", speck: "#4a453c", stitch: "#d4c4a8" },
  antracit: { fill: "#141820", speck: "#3a4658", stitch: "#c5d0d8" },
  koks: { fill: "#6a6358", speck: "#9a9184", stitch: "#eadcc4" },
};

export function BagMark({
  fuelId,
  className,
  weight,
}: {
  fuelId: FuelId;
  className?: string;
  weight: number;
}) {
  const tone = tones[fuelId];
  return (
    <svg
      viewBox="0 0 160 200"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`${weight} kg vrece`}
    >
      <rect width="160" height="200" rx="18" fill="#cbb79a" />
      <rect x="10" y="10" width="140" height="180" rx="12" fill="#e7d7bc" />
      <path
        d="M28 48h104l-8 118H36Z"
        fill={tone.fill}
      />
      <circle cx="58" cy="92" r="5" fill={tone.speck} opacity="0.7" />
      <circle cx="92" cy="108" r="4" fill={tone.speck} opacity="0.55" />
      <circle cx="74" cy="128" r="6" fill={tone.speck} opacity="0.4" />
      <circle cx="108" cy="86" r="3.5" fill={tone.speck} opacity="0.5" />
      <path
        d="M40 58h80M44 160h72"
        stroke={tone.stitch}
        strokeWidth="2"
        strokeDasharray="4 6"
        opacity="0.8"
      />
      <rect x="48" y="70" width="64" height="36" rx="4" fill="#efe4d2" />
      <text
        x="80"
        y="93"
        textAnchor="middle"
        fill="#2a2218"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="16"
        fontWeight="700"
      >
        {weight} kg
      </text>
    </svg>
  );
}
