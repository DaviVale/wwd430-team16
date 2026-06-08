import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-images";

export type UploadedImage = { url: string; path: string };

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isSupportedImageType(type: string): boolean {
  return type in EXT_BY_TYPE;
}

/**
 * Upload an image to the public `product-images` bucket via the Supabase
 * Storage REST API (authenticated with the service-role key). Returns the
 * public URL plus the object path (kept so the image can be deleted later).
 */
export async function uploadProductImage(file: File, sellerId: string): Promise<UploadedImage> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Supabase storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  const ext = EXT_BY_TYPE[file.type] ?? "bin";
  const path = `${sellerId}/${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": file.type,
    },
    body: bytes,
  });

  if (!res.ok) {
    throw new Error(`Image upload failed (${res.status}): ${await res.text()}`);
  }

  return {
    url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`,
    path,
  };
}

/** Best-effort delete of a previously uploaded image. Never throws. */
export async function deleteProductImage(path: string | null | undefined): Promise<void> {
  if (!path || !SUPABASE_URL || !SERVICE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${SERVICE_KEY}` },
    });
  } catch {
    // A dangling object is harmless; don't fail the surrounding mutation.
  }
}
