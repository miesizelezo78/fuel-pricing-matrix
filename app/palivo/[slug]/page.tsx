import Link from "next/link";
import { notFound } from "next/navigation";
import { BagMark } from "@/components/bag-mark";
import { BuyPanel } from "@/components/buy-panel";
import { Badge } from "@/components/ui/badge";
import {
  PRODUCTS,
  getFuel,
  getProduct,
  palletKg,
  type CatalogProduct,
} from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produkt" };
  return {
    title: product.name,
    description: product.lead,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const fuel = getFuel(product.fuelId);
  const sister = sisterProduct(product);

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          {product.eyebrow}
        </p>
        <h1 className="font-heading mt-2 text-4xl sm:text-5xl">{product.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{fuel.bagKg} kg vrece</Badge>
          {product.channel === "solo" ? (
            <Badge>Doprava v cene</Badge>
          ) : (
            <Badge>
              Paleta {fuel.palletBags} vriec = {palletKg(fuel)} kg
            </Badge>
          )}
        </div>
        <div className="mx-auto mt-8 h-64 w-48 sm:h-72 sm:w-56">
          <BagMark fuelId={fuel.id} weight={fuel.bagKg} />
        </div>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {fuel.summary} {product.lead}
        </p>
        {sister ? (
          <p className="mt-4 text-sm">
            {product.channel === "solo" ? (
              <>
                Treba viac ako kuriér unesie?{" "}
                <Link href={`/palivo/${sister.slug}`} className="underline underline-offset-4">
                  {sister.name}
                </Link>
              </>
            ) : (
              <>
                Len vzorka alebo hobby vrece?{" "}
                <Link href={`/palivo/${sister.slug}`} className="underline underline-offset-4">
                  {sister.name} s doručením
                </Link>
              </>
            )}
          </p>
        ) : null}
      </div>
      <div className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:p-7">
        <BuyPanel product={product} />
      </div>
    </div>
  );
}

function sisterProduct(product: CatalogProduct) {
  const other = product.channel === "solo" ? "bulk" : "solo";
  return PRODUCTS.find(
    (item) => item.fuelId === product.fuelId && item.channel === other,
  );
}
