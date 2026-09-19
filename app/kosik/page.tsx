import { CartView } from "@/components/cart-view";

export const metadata = {
  title: "Košík",
};

export default function CartPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Nákup</p>
        <h1 className="font-heading mt-1 text-4xl">Košík</h1>
      </div>
      <CartView />
    </div>
  );
}
