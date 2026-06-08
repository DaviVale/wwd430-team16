// Pure module (no server-only imports) so both client and server components
// can use the product category list and helpers.

export const PRODUCT_CATEGORIES = [
  { slug: "ceramics", label: "Ceramics" },
  { slug: "textiles", label: "Textiles" },
  { slug: "woodworking", label: "Woodworking" },
  { slug: "jewelry", label: "Jewelry" },
  { slug: "art", label: "Art & Prints" },
  { slug: "home-goods", label: "Home Goods" },
  { slug: "candles", label: "Candles" },
  { slug: "bath-beauty", label: "Bath & Beauty" },
  { slug: "paper-goods", label: "Paper Goods" },
  { slug: "other", label: "Other" },
] as const;

const CATEGORY_LABELS = new Map<string, string>(
  PRODUCT_CATEGORIES.map((c) => [c.slug, c.label]),
);

export function isValidCategory(slug: string): boolean {
  return CATEGORY_LABELS.has(slug);
}

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS.get(slug) ?? slug;
}
