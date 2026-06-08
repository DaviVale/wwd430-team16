"use client";

import { deleteListing } from "./actions";

export default function DeleteListingButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteListing}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
