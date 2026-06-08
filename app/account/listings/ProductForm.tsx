"use client";

import { useActionState } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import type { ListingState } from "./actions";

type ProductFormProps = {
  action: (prev: ListingState, formData: FormData) => Promise<ListingState>;
  submitLabel: string;
  productId?: string;
  currentImageUrl?: string | null;
  defaults?: {
    title: string;
    description: string;
    price: string;
    category: string;
  };
};

const initialState: ListingState = { ok: false, message: "" };
const inputClass = "rounded-md border border-black/10 px-3 py-2";

export default function ProductForm({
  action,
  submitLabel,
  productId,
  currentImageUrl,
  defaults,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEdit = Boolean(productId);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      {productId ? <input type="hidden" name="id" value={productId} /> : null}

      <label className="grid gap-1">
        <span className="text-sm font-medium">Title</span>
        <input name="title" type="text" defaultValue={defaults?.title ?? ""} required className={inputClass} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Description</span>
        <textarea name="description" rows={5} defaultValue={defaults?.description ?? ""} className={inputClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Price (USD)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="24.99"
            defaultValue={defaults?.price ?? ""}
            required
            className={inputClass}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Category</span>
          <select name="category" defaultValue={defaults?.category ?? "other"} className={inputClass}>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {currentImageUrl ? (
        <div className="grid gap-1">
          <span className="text-sm font-medium">Current image</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentImageUrl} alt="" className="h-32 w-32 rounded-md object-cover" />
        </div>
      ) : null}

      <label className="grid gap-1">
        <span className="text-sm font-medium">{isEdit ? "Replace image" : "Product image"}</span>
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required={!isEdit}
          className="text-sm"
        />
        {isEdit ? <span className="text-xs opacity-60">Leave blank to keep the current image.</span> : null}
      </label>

      {state.message ? (
        <p role="status" className={`text-sm ${state.ok ? "text-[#28582e]" : "text-red-600"}`}>
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
