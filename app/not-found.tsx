import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="rounded-2xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="font-heading mt-2 text-4xl">Táto položka v katalógu nie je</h1>
      <p className="mt-3 text-muted-foreground">
        Skontrolujte odkaz, alebo sa vráťte k uhliu, koksu a antracitu.
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="mt-6">
        Do katalógu
      </Button>
    </div>
  );
}
