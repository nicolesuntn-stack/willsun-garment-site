"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ProductCategory } from "@/lib/products";

type FilterOption = {
  value: "all" | ProductCategory;
  label: string;
};

type ProductFiltersProps = {
  options: FilterOption[];
};

export function ProductFilters({ options }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";

  function onClick(value: "all" | ProductCategory) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      next.delete("category");
    } else {
      next.set("category", value);
    }

    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === active;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onClick(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              isActive ? "bg-primary text-white" : "bg-slate-100 text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
