"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <CartProvider>
        {children}
        <Toaster position="top-center" richColors />
      </CartProvider>
    </ThemeProvider>
  );
}
