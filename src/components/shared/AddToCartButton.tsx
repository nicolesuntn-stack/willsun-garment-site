"use client";

import { useState } from "react";

import { addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  item: {
    slug: string;
    name: string;
    category: string;
  };
  addLabel: string;
  addedLabel: string;
  existsLabel: string;
};

export function AddToCartButton({ item, addLabel, addedLabel, existsLabel }: AddToCartButtonProps) {
  const [status, setStatus] = useState<"idle" | "added" | "exists">("idle");

  function onAdd() {
    const result = addToCart(item);
    setStatus(result.added ? "added" : "exists");
  }

  const hint = status === "added" ? addedLabel : status === "exists" ? existsLabel : "";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onAdd}
        className="rounded-full border border-ink px-4 py-2 text-xs font-semibold text-ink hover:bg-ink hover:text-white"
      >
        {addLabel}
      </button>
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </div>
  );
}
