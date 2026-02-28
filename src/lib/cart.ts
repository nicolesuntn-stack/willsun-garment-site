export const CART_STORAGE_KEY = "willsun_procurement_cart_v1";
export const CART_UPDATED_EVENT = "willsun-cart-updated";

export type CartItem = {
  slug: string;
  name: string;
  category: string;
};

export function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.slug === "string" &&
        typeof item.name === "string" &&
        typeof item.category === "string"
    );
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function addToCart(item: CartItem): { items: CartItem[]; added: boolean } {
  const existing = readCart();
  const found = existing.some((entry) => entry.slug === item.slug);
  if (found) {
    return { items: existing, added: false };
  }

  const next = [...existing, item];
  writeCart(next);
  return { items: next, added: true };
}

export function removeFromCart(slug: string): CartItem[] {
  const next = readCart().filter((item) => item.slug !== slug);
  writeCart(next);
  return next;
}

export function clearCart(): void {
  writeCart([]);
}
