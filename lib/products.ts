import { randomBytes } from "crypto";
import { query } from "@/lib/db";
import { slugify } from "@/lib/sellers";

export {
  PRODUCT_CATEGORIES,
  isValidCategory,
  categoryLabel,
} from "@/lib/categories";

export type Product = {
  id: string;
  sellerId: string;
  title: string;
  slug: string;
  description: string | null;
  priceCents: number;
  category: string;
  imageUrl: string | null;
  imagePath: string | null;
};

/** A product joined with its seller, for public-facing pages. */
export type ProductWithSeller = Product & {
  shopName: string;
  sellerSlug: string;
};

const PRODUCT_FIELDS = `
  id, "sellerId", title, slug, description, "priceCents", category, "imageUrl", "imagePath"
`;

const PRODUCT_FIELDS_P = `
  p.id, p."sellerId", p.title, p.slug, p.description, p."priceCents",
  p.category, p."imageUrl", p."imagePath"
`;

const PRODUCT_WITH_SELLER_FIELDS = `
  p.id, p."sellerId", p.title, p.slug, p.description, p."priceCents",
  p.category, p."imageUrl", p."imagePath",
  s."shopName", s.slug as "sellerSlug"
`;

export type ProductInput = {
  title: string;
  description: string | null;
  priceCents: number;
  category: string;
  imageUrl: string | null;
  imagePath: string | null;
};

function generateSlug(title: string): string {
  const base = slugify(title) || "item";
  return `${base}-${randomBytes(3).toString("hex")}`;
}

/** All listings owned by a seller, newest first. */
export async function listProductsBySeller(sellerId: string): Promise<Product[]> {
  const result = await query<Product>(
    `select ${PRODUCT_FIELDS} from public.products
      where "sellerId" = $1 order by "createdAt" desc`,
    [sellerId],
  );
  return result.rows;
}

/** A single listing the given seller owns (for edit/delete), or null. */
export async function getOwnedProduct(id: string, sellerId: string): Promise<Product | null> {
  const result = await query<Product>(
    `select ${PRODUCT_FIELDS} from public.products where id = $1 and "sellerId" = $2`,
    [id, sellerId],
  );
  return result.rows[0] ?? null;
}

/** Public product detail by slug, joined with the seller. */
export async function getProductBySlug(slug: string): Promise<ProductWithSeller | null> {
  const result = await query<ProductWithSeller>(
    `select ${PRODUCT_WITH_SELLER_FIELDS}
       from public.products p
       join public.sellers s on s."userId" = p."sellerId"
      where p.slug = $1`,
    [slug],
  );
  return result.rows[0] ?? null;
}

/** All listings for a seller's public storefront. */
export async function listProductsForSellerSlug(sellerSlug: string): Promise<Product[]> {
  const result = await query<Product>(
    `select ${PRODUCT_FIELDS_P}
       from public.products p
       join public.sellers s on s."userId" = p."sellerId"
      where s.slug = $1
      order by p."createdAt" desc`,
    [sellerSlug],
  );
  return result.rows;
}

/** All listings (for the shop), newest first. */
export async function listAllProducts(): Promise<ProductWithSeller[]> {
  const result = await query<ProductWithSeller>(
    `select ${PRODUCT_WITH_SELLER_FIELDS}
       from public.products p
       join public.sellers s on s."userId" = p."sellerId"
      order by p."createdAt" desc`,
  );
  return result.rows;
}

/** Listings in a category (for /shop/[category]). */
export async function listProductsByCategory(category: string): Promise<ProductWithSeller[]> {
  const result = await query<ProductWithSeller>(
    `select ${PRODUCT_WITH_SELLER_FIELDS}
       from public.products p
       join public.sellers s on s."userId" = p."sellerId"
      where p.category = $1
      order by p."createdAt" desc`,
    [category],
  );
  return result.rows;
}

/** Create a listing; returns the generated slug. */
export async function createProduct(sellerId: string, input: ProductInput): Promise<string> {
  const slug = generateSlug(input.title);
  await query(
    `insert into public.products
       ("sellerId", title, slug, description, "priceCents", category, "imageUrl", "imagePath")
     values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      sellerId,
      input.title,
      slug,
      input.description,
      input.priceCents,
      input.category,
      input.imageUrl,
      input.imagePath,
    ],
  );
  return slug;
}

/**
 * Update a listing the seller owns. Only overwrites the image when a new one
 * was uploaded (imageUrl/imagePath non-null). Returns the affected row count.
 */
export async function updateProduct(
  id: string,
  sellerId: string,
  input: ProductInput & { replaceImage: boolean },
): Promise<number> {
  const result = await query(
    `update public.products set
        title = $1,
        description = $2,
        "priceCents" = $3,
        category = $4,
        "imageUrl" = case when $5 then $6 else "imageUrl" end,
        "imagePath" = case when $5 then $7 else "imagePath" end
      where id = $8 and "sellerId" = $9`,
    [
      input.title,
      input.description,
      input.priceCents,
      input.category,
      input.replaceImage,
      input.imageUrl,
      input.imagePath,
      id,
      sellerId,
    ],
  );
  return result.rowCount ?? 0;
}

/** Delete a listing the seller owns; returns its imagePath (to clean up storage). */
export async function deleteProduct(id: string, sellerId: string): Promise<string | null> {
  const result = await query<{ imagePath: string | null }>(
    `delete from public.products where id = $1 and "sellerId" = $2 returning "imagePath"`,
    [id, sellerId],
  );
  return result.rows[0]?.imagePath ?? null;
}
