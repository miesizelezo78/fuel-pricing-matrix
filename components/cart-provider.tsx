"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { toast } from "sonner";
import { getFuel, getProductById } from "@/lib/catalog";
import {
  clampSoloBags,
  priceCart,
  type CartLine,
  type CartState,
  type PaymentMethod,
} from "@/lib/pricing";

const STORAGE_KEY = "kovacske-paliva-cart";

const emptyCart: CartState = { lines: [], payment: "transfer" };

type CartContextValue = {
  ready: boolean;
  cart: CartState;
  addBags: (productId: string, bags: number) => boolean;
  setBags: (productId: string, bags: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setPayment: (payment: PaymentMethod) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

let storageBound = 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (storageBound === 0) {
    window.addEventListener("storage", onStorage);
  }
  storageBound += 1;
  return () => {
    listeners.delete(listener);
    storageBound -= 1;
    if (storageBound === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY || event.key === null) emit();
}

function normalize(cart: CartState): CartState {
  const merged = new Map<string, number>();
  for (const line of cart.lines) {
    const product = getProductById(line.productId);
    if (!product) continue;
    if (product.channel !== "solo") continue;
    const fuel = getFuel(product.fuelId);
    const current = merged.get(line.productId) ?? 0;
    merged.set(line.productId, clampSoloBags(fuel, current + line.bags));
  }
  const lines: CartLine[] = [...merged.entries()]
    .filter(([, bags]) => bags > 0)
    .map(([productId, bags]) => ({ productId, bags }));
  return {
    lines,
    payment: cart.payment === "cod" ? "cod" : "transfer",
  };
}

let snapshot: { raw: string | null; cart: CartState } = {
  raw: null,
  cart: emptyCart,
};

function parseCart(raw: string | null): CartState {
  if (!raw) return emptyCart;
  try {
    return normalize(JSON.parse(raw) as CartState);
  } catch {
    return emptyCart;
  }
}

function readCart(): CartState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === snapshot.raw) return snapshot.cart;
  snapshot = { raw, cart: parseCart(raw) };
  return snapshot.cart;
}

function writeCart(cart: CartState) {
  const normalized = normalize(cart);
  const raw = JSON.stringify(normalized);
  window.localStorage.setItem(STORAGE_KEY, raw);
  snapshot = { raw, cart: normalized };
  emit();
}

function applyLine(current: CartState, productId: string, bags: number) {
  const product = getProductById(productId);
  if (!product) return { cart: current, accepted: false as const };
  if (product.channel !== "solo") {
    return { cart: current, accepted: false as const };
  }
  const fuel = getFuel(product.fuelId);
  let nextBags = bags;
  let accepted = true;

  if (bags > fuel.soloMaxBags) {
    accepted = false;
    nextBags = fuel.soloMaxBags;
  } else if (bags <= 0) {
    nextBags = 0;
  } else {
    nextBags = clampSoloBags(fuel, bags);
  }

  const lines = current.lines.filter((line) => line.productId !== productId);
  if (nextBags > 0) lines.push({ productId, bags: nextBags });
  return { cart: { ...current, lines }, accepted };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(subscribe, readCart, () => emptyCart);

  const addBags = useCallback((productId: string, bags: number) => {
    const current = readCart();
    const existing = current.lines.find((line) => line.productId === productId);
    const result = applyLine(current, productId, (existing?.bags ?? 0) + bags);
    writeCart(result.cart);
    if (!result.accepted) {
      const product = getProductById(productId);
      const fuel = product ? getFuel(product.fuelId) : null;
      toast.error(
        fuel
          ? `Kuriér SDS unesie najviac ${fuel.soloMaxBags} vrecia ${fuel.adjective}. Na viac použite paletovú objednávku od 100 kg.`
          : "Toto množstvo kuriér neprevezie.",
      );
    }
    return result.accepted;
  }, []);

  const setBags = useCallback((productId: string, bags: number) => {
    writeCart(applyLine(readCart(), productId, bags).cart);
  }, []);

  const remove = useCallback((productId: string) => {
    const current = readCart();
    writeCart({
      ...current,
      lines: current.lines.filter((line) => line.productId !== productId),
    });
  }, []);

  const clear = useCallback(() => writeCart(emptyCart), []);

  const setPayment = useCallback((payment: PaymentMethod) => {
    writeCart({ ...readCart(), payment });
  }, []);

  const value = useMemo(
    () => ({
      ready: true,
      cart,
      addBags,
      setBags,
      remove,
      clear,
      setPayment,
    }),
    [cart, addBags, setBags, remove, clear, setPayment],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}

export function usePricedCart() {
  const { cart, ready } = useCart();
  return { ready, cart, priced: priceCart(cart) };
}
