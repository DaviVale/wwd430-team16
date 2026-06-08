"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { upsertSeller, slugify } from "@/lib/sellers";

export type SellerState = {
  ok: boolean;
  message: string;
  /** Set on a successful save so the UI can link to the live shop. */
  slug?: string;
};

function parseSpecialties(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveSeller(
  _prevState: SellerState,
  formData: FormData,
): Promise<SellerState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "You must be signed in to manage your shop." };
  }

  const shopName = String(formData.get("shopName") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || shopName);

  if (!shopName) {
    return { ok: false, message: "Shop name is required." };
  }
  if (!slug) {
    return { ok: false, message: "Please provide a valid shop URL (letters and numbers)." };
  }

  try {
    await upsertSeller(session.user.id, {
      shopName,
      slug,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      specialties: parseSpecialties(String(formData.get("specialties") ?? "")),
      websiteUrl: String(formData.get("websiteUrl") ?? "").trim() || null,
      instagramUrl: String(formData.get("instagramUrl") ?? "").trim() || null,
    });
  } catch (err) {
    // sellers.slug is unique — another shop already uses this URL.
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      return { ok: false, message: `The shop URL "${slug}" is already taken. Try another.` };
    }
    throw err;
  }

  revalidatePath("/account/seller");
  revalidatePath("/sellers");
  revalidatePath(`/sellers/${slug}`);
  return { ok: true, message: "Shop profile saved.", slug };
}
