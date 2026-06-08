"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";

type ProfileFormProps = {
  defaultName: string;
  defaultEmail: string;
  defaultShippingAddress: string;
};

const initialState: ProfileState = { ok: false, message: "" };

export default function ProfileForm({
  defaultName,
  defaultEmail,
  defaultShippingAddress,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <label className="grid gap-1">
        <span className="text-sm font-medium">Name</span>
        <input
          name="name"
          type="text"
          defaultValue={defaultName}
          required
          className="rounded-md border border-black/10 px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          defaultValue={defaultEmail}
          className="rounded-md border border-black/10 px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Shipping address</span>
        <textarea
          name="shippingAddress"
          rows={3}
          defaultValue={defaultShippingAddress}
          className="rounded-md border border-black/10 px-3 py-2"
        />
      </label>

      {state.message ? (
        <p
          role="status"
          className={`text-sm ${state.ok ? "text-[#28582e]" : "text-red-600"}`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
