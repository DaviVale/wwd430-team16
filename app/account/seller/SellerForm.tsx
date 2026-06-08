"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveSeller, type SellerState } from "./actions";

type SellerFormProps = {
  isSeller: boolean;
  defaults: {
    shopName: string;
    slug: string;
    tagline: string;
    bio: string;
    location: string;
    specialties: string;
    websiteUrl: string;
    instagramUrl: string;
  };
};

const initialState: SellerState = { ok: false, message: "" };

const inputClass = "rounded-md border border-black/10 px-3 py-2";

export default function SellerForm({ isSeller, defaults }: SellerFormProps) {
  const [state, formAction, pending] = useActionState(saveSeller, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <label className="grid gap-1">
        <span className="text-sm font-medium">Shop name</span>
        <input name="shopName" type="text" defaultValue={defaults.shopName} required className={inputClass} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Shop URL</span>
        <input
          name="slug"
          type="text"
          defaultValue={defaults.slug}
          placeholder="auto-generated from shop name"
          className={inputClass}
        />
        <span className="text-xs opacity-60">Your shop will live at /sellers/your-shop-url</span>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Tagline</span>
        <input
          name="tagline"
          type="text"
          defaultValue={defaults.tagline}
          placeholder="Handmade ceramics & textiles"
          className={inputClass}
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">About your shop</span>
        <textarea name="bio" rows={4} defaultValue={defaults.bio} className={inputClass} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Location</span>
        <input name="location" type="text" defaultValue={defaults.location} placeholder="Rexburg, ID" className={inputClass} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Specialties</span>
        <input
          name="specialties"
          type="text"
          defaultValue={defaults.specialties}
          placeholder="Woodworking, Home goods, Furniture"
          className={inputClass}
        />
        <span className="text-xs opacity-60">Comma-separated</span>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Website</span>
        <input name="websiteUrl" type="url" defaultValue={defaults.websiteUrl} placeholder="https://" className={inputClass} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Instagram</span>
        <input name="instagramUrl" type="url" defaultValue={defaults.instagramUrl} placeholder="https://instagram.com/" className={inputClass} />
      </label>

      {state.message ? (
        <p role="status" className={`text-sm ${state.ok ? "text-[#28582e]" : "text-red-600"}`}>
          {state.message}
          {state.ok && state.slug ? (
            <>
              {" "}
              <Link href={`/sellers/${state.slug}`} className="font-medium underline">
                View your shop
              </Link>
            </>
          ) : null}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : isSeller ? "Save changes" : "Open my shop"}
      </button>
    </form>
  );
}
