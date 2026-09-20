import { redirect } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/catalog";
import { WOO_PRODUCT, palletOrderHref } from "@/lib/paths";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (product?.channel === "solo") {
    redirect(WOO_PRODUCT[product.fuelId]);
  }
  if (product?.channel === "bulk") {
    redirect(palletOrderHref(product.fuelId));
  }
  redirect("/paliva");
}
