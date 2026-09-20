"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { usePricedCart } from "@/components/cart-provider";

const links = [
  { href: "/paliva", label: "Palivá" },
  { href: "/objednavka-paleta", label: "Paleta" },
  { href: "/ako-to-predavame", label: "Ako to predávame" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { ready, priced } = usePricedCart();
  const count = ready ? priced.itemCount : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#030303] text-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:min-h-[4.5rem] sm:px-6">
        <Link href="/" className="flex min-w-0 shrink-0 items-center">
          <img
            src="/vulcanus-logo-white.png"
            alt="VULCANUS"
            className="h-7 w-auto sm:h-8"
            width={252}
            height={28}
          />
        </Link>
        <nav className="flex min-w-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
          {links.map((link) => {
            const active =
              link.href === "/paliva"
                ? pathname === "/paliva" ||
                  pathname === "/" ||
                  (pathname.startsWith("/palivo") && !pathname.includes("objednavka"))
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-none px-2.5 py-1.5 text-sm tracking-wide uppercase transition-colors sm:px-3",
                  active
                    ? "bg-primary text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
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
            className={cn(
              "ml-1 rounded-none border-white/30",
              pathname === "/kosik" ||
                (pathname.startsWith("/objednavka") &&
                  !pathname.startsWith("/objednavka-paleta"))
                ? ""
                : "bg-transparent text-white hover:bg-white/10 hover:text-white",
            )}
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
