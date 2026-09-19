"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { usePricedCart } from "@/components/cart-provider";

const links = [
  { href: "/", label: "Palivá" },
  { href: "/objednavka-paleta", label: "Paleta" },
  { href: "/ako-to-funguje", label: "Ako to predávame" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { ready, priced } = usePricedCart();
  const count = ready ? priced.itemCount : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-[color-mix(in_oklch,var(--background)_88%,white)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Link href="/" className="flex items-baseline gap-2 tracking-tight">
          <span className="font-heading text-xl text-foreground sm:text-2xl">
            Kováčske palivá
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            Uhlie · koks · antracit
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/" ||
                  (pathname.startsWith("/palivo") && !pathname.includes("objednavka"))
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/75 hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Button
            nativeButton={false}
            render={<Link href="/kosik" />}
            variant={
              pathname === "/kosik" ||
              (pathname.startsWith("/objednavka") &&
                !pathname.startsWith("/objednavka-paleta"))
                ? "default"
                : "outline"
            }
            className="ml-1"
          >
            <ShoppingBag />
            Košík
            <span className="tabular-nums">{count}</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
