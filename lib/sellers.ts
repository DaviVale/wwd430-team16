import { query } from "@/lib/db";

export type Seller = {
  userId: string;
  shopName: string;
  slug: string;
  tagline: string | null;
  bio: string | null;
  location: string | null;
  specialties: string[];
  websiteUrl: string | null;
  instagramUrl: string | null;
  /** Display name / avatar pulled from the linked user row. */
  name: string | null;
  image: string | null;
};

const SELECT_FIELDS = `
  s."userId", s."shopName", s.slug, s.tagline, s.bio, s.location,
  s.specialties, s."websiteUrl", s."instagramUrl",
  u.name, u.image
`;

/** All sellers, newest shop first, joined with their user for name/avatar. */
export async function listSellers(): Promise<Seller[]> {
  const result = await query<Seller>(
    `select ${SELECT_FIELDS}
       from public.sellers s
       join public.users u on u.id = s."userId"
      order by s."createdAt" desc`,
  );
  return result.rows;
}

/** A single seller by their public slug, or null if not found. */
export async function getSellerBySlug(slug: string): Promise<Seller | null> {
  const result = await query<Seller>(
    `select ${SELECT_FIELDS}
       from public.sellers s
       join public.users u on u.id = s."userId"
      where s.slug = $1`,
    [slug],
  );
  return result.rows[0] ?? null;
}

/** The seller profile owned by a given user, or null if they aren't a seller. */
export async function getSellerByUserId(userId: string): Promise<Seller | null> {
  const result = await query<Seller>(
    `select ${SELECT_FIELDS}
       from public.sellers s
       join public.users u on u.id = s."userId"
      where s."userId" = $1`,
    [userId],
  );
  return result.rows[0] ?? null;
}

export type SellerInput = {
  shopName: string;
  slug: string;
  tagline: string | null;
  bio: string | null;
  location: string | null;
  specialties: string[];
  websiteUrl: string | null;
  instagramUrl: string | null;
};

/** Create or update the seller profile for a user (one-to-one with users.id). */
export async function upsertSeller(userId: string, input: SellerInput): Promise<void> {
  await query(
    `insert into public.sellers
       ("userId", "shopName", slug, tagline, bio, location, specialties, "websiteUrl", "instagramUrl")
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     on conflict ("userId") do update set
       "shopName"     = excluded."shopName",
       slug           = excluded.slug,
       tagline        = excluded.tagline,
       bio            = excluded.bio,
       location       = excluded.location,
       specialties    = excluded.specialties,
       "websiteUrl"   = excluded."websiteUrl",
       "instagramUrl" = excluded."instagramUrl"`,
    [
      userId,
      input.shopName,
      input.slug,
      input.tagline,
      input.bio,
      input.location,
      input.specialties,
      input.websiteUrl,
      input.instagramUrl,
    ],
  );
}

/** Turn a shop name into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
