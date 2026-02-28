"use client";

import { useEffect, useState, type FormEvent } from "react";

import { clearCart, readCart, removeFromCart, type CartItem } from "@/lib/cart";

type InquiryFormProps = {
  labels: {
    companyName: string;
    managerContact: string;
    category: string;
    quantity: string;
    targetPrice: string;
    selectedProducts: string;
    emptyCart: string;
    removeItem: string;
    clearCart: string;
    submit: string;
    success: string;
  };
};

type FormState = {
  companyName: string;
  managerContact: string;
  category: string;
  quantity: string;
  targetPrice: string;
};

const initialState: FormState = {
  companyName: "",
  managerContact: "",
  category: "",
  quantity: "",
  targetPrice: ""
};

export function InquiryForm({ labels }: InquiryFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCartItems(readCart());
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        selectedProducts: cartItems.map((item) => ({
          slug: item.slug,
          name: item.name,
          category: item.category
        }))
      })
    });

    setLoading(false);

    if (response.ok) {
      setForm(initialState);
      clearCart();
      setCartItems([]);
      setMessage(labels.success);
      return;
    }

    setMessage("Failed to submit. Please try again.");
  }

  function onRemove(slug: string) {
    setCartItems(removeFromCart(slug));
  }

  function onClearCart() {
    clearCart();
    setCartItems([]);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">{labels.selectedProducts}</h3>
          {cartItems.length > 0 ? (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs font-semibold text-primary underline"
            >
              {labels.clearCart}
            </button>
          ) : null}
        </div>
        {cartItems.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{labels.emptyCart}</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {cartItems.map((item) => (
              <li key={item.slug} className="flex items-center justify-between gap-3 rounded bg-white px-3 py-2">
                <span>
                  {item.name} ({item.slug})
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(item.slug)}
                  className="text-xs font-semibold text-primary underline"
                >
                  {labels.removeItem}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <label className="block text-sm font-medium text-ink">
        {labels.companyName}
        <input
          required
          value={form.companyName}
          onChange={(event) => setForm({ ...form, companyName: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        {labels.managerContact}
        <input
          required
          value={form.managerContact}
          onChange={(event) => setForm({ ...form, managerContact: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        {labels.category}
        <input
          required
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        {labels.quantity}
        <input
          required
          value={form.quantity}
          onChange={(event) => setForm({ ...form, quantity: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium text-ink">
        {labels.targetPrice}
        <input
          required
          value={form.targetPrice}
          onChange={(event) => setForm({ ...form, targetPrice: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <button
        disabled={loading}
        type="submit"
        className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Submitting..." : labels.submit}
      </button>

      {message ? <p className="text-sm text-primary">{message}</p> : null}
    </form>
  );
}
