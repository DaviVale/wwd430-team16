"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getSellerByUserId, type Seller } from "@/lib/sellers";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getOwnedProduct,
} from "@/lib/products";
import { isValidCategory } from "@/lib/categories";
import { uploadProductImage, deleteProductImage, isSupportedImageType } from "@/lib/storage";

export type ListingState = { ok: boolean; message: string };

/** Resolve the current user's seller profile, or null if not signed in / not a seller. */
async function currentSeller(): Promise<Seller | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return getSellerByUserId(session.user.id); // sellerId === users.id
}

/** Revalidate every page that renders a seller's listings. */
function revalidateListingViews(sellerSlug: string, productSlug?: string) {
  revalidatePath("/account/listings");
  revalidatePath("/sellers");
  revalidatePath(`/sellers/${sellerSlug}`);
  revalidatePath("/shop");
  if (productSlug) revalidatePath(`/products/${productSlug}`);
}

type ParsedFields =
  | { ok: true; title: string; description: string | null; priceCents: number; category: string }
  | { ok: false; message: string };

function parseFields(formData: FormData): ParsedFields {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, message: "Title is required." };

  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = Number(priceRaw);
  if (!priceRaw || !Number.isFinite(price) || price < 0) {
    return { ok: false, message: "Enter a valid price (e.g. 24.99)." };
  }
  const priceCents = Math.round(price * 100);

  let category = String(formData.get("category") ?? "").trim();
  if (!isValidCategory(category)) category = "other";

  const description = String(formData.get("description") ?? "").trim() || null;

  return { ok: true, title, description, priceCents, category };
}

function getImageFile(formData: FormData): File | null {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) return file;
  return null;
}

export async function createListing(
  _prev: ListingState,
  formData: FormData,
): Promise<ListingState> {
  const seller = await currentSeller();
  if (!seller) return { ok: false, message: "Open a shop before creating listings." };
  const sellerId = seller.userId;

  const fields = parseFields(formData);
  if (!fields.ok) return fields;

  const file = getImageFile(formData);
  if (!file) return { ok: false, message: "Please add a product image." };
  if (!isSupportedImageType(file.type)) {
    return { ok: false, message: "Image must be a JPEG, PNG, WebP, or GIF." };
  }

  let image;
  try {
    image = await uploadProductImage(file, sellerId);
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Image upload failed." };
  }

  try {
    await createProduct(sellerId, {
      title: fields.title,
      description: fields.description,
      priceCents: fields.priceCents,
      category: fields.category,
      imageUrl: image.url,
      imagePath: image.path,
    });
  } catch (err) {
    await deleteProductImage(image.path); // avoid an orphaned upload
    throw err;
  }

  revalidateListingViews(seller.slug);
  redirect("/account/listings");
}

export async function updateListing(
  _prev: ListingState,
  formData: FormData,
): Promise<ListingState> {
  const seller = await currentSeller();
  if (!seller) return { ok: false, message: "You must be signed in as a seller." };
  const sellerId = seller.userId;

  const id = String(formData.get("id") ?? "");
  const existing = await getOwnedProduct(id, sellerId);
  if (!existing) return { ok: false, message: "Listing not found." };

  const fields = parseFields(formData);
  if (!fields.ok) return fields;

  // Only replace the image if the seller uploaded a new one.
  let replaceImage = false;
  let imageUrl: string | null = null;
  let imagePath: string | null = null;
  const file = getImageFile(formData);
  if (file) {
    if (!isSupportedImageType(file.type)) {
      return { ok: false, message: "Image must be a JPEG, PNG, WebP, or GIF." };
    }
    try {
      const image = await uploadProductImage(file, sellerId);
      imageUrl = image.url;
      imagePath = image.path;
      replaceImage = true;
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : "Image upload failed." };
    }
  }

  await updateProduct(id, sellerId, {
    title: fields.title,
    description: fields.description,
    priceCents: fields.priceCents,
    category: fields.category,
    imageUrl,
    imagePath,
    replaceImage,
  });

  // The new image is saved; remove the old object from storage.
  if (replaceImage && existing.imagePath) {
    await deleteProductImage(existing.imagePath);
  }

  revalidateListingViews(seller.slug, existing.slug);
  redirect("/account/listings");
}

export async function deleteListing(formData: FormData): Promise<void> {
  const seller = await currentSeller();
  if (!seller) return;

  const id = String(formData.get("id") ?? "");
  const imagePath = await deleteProduct(id, seller.userId);
  await deleteProductImage(imagePath);

  revalidateListingViews(seller.slug);
}
