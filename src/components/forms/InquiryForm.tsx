"use client";

import { useState, type FormEvent } from "react";

type InquiryFormProps = {
  labels: {
    companyName: string;
    managerContact: string;
    category: string;
    quantity: string;
    targetPrice: string;
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setLoading(false);

    if (response.ok) {
      setForm(initialState);
      setMessage(labels.success);
      return;
    }

    setMessage("Failed to submit. Please try again.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
