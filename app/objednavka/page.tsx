import { CheckoutForm } from "@/components/checkout-form";

export const metadata = {
  title: "Objednávka",
};

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-primary">
          Bez platobnej brány
        </p>
        <h1 className="font-heading mt-1 text-4xl">Objednávka</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
