"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { query } from "@/lib/db";

export type ProfileState = {
  ok: boolean;
  message: string;
};

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "You must be signed in to update your profile." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const shippingAddress = String(formData.get("shippingAddress") ?? "").trim();

  if (!name) {
    return { ok: false, message: "Name is required." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  try {
    await query(
      `update users
          set name = $1,
              email = $2,
              "shippingAddress" = $3
        where id = $4`,
      [name, email || null, shippingAddress || null, session.user.id],
    );
  } catch (err) {
    // users_email_unique: another account already uses this email.
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      return { ok: false, message: "That email is already in use by another account." };
    }
    throw err;
  }

  revalidatePath("/account/profile");
  return { ok: true, message: "Profile updated." };
}
