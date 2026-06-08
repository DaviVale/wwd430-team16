import Link from "next/link";
import { notFound } from "next/navigation";
import ProductReviews from "@/app/_components/ProductReviews";
import { getProductBySlug, categoryLabel } from "@/lib/products";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-2">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="aspect-square w-full rounded-lg object-cover"
          />
        ) : (
          <div className="aspect-square w-full rounded-lg bg-[#e5e5e5]" />
        )}
        <div>
          <p className="text-sm uppercase tracking-wide opacity-60">
            {categoryLabel(product.category)}
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-montserrat)] text-4xl font-bold">
            {product.title}
          </h1>
          <p className="mt-2 opacity-70">
            By{" "}
            <Link href={`/sellers/${product.sellerSlug}`} className="font-medium text-[#28582e] hover:underline">
              {product.shopName}
            </Link>
          </p>
          <p className="mt-6 text-3xl font-semibold">{formatPrice(product.priceCents)}</p>
          {product.description ? (
            <p className="mt-6 whitespace-pre-line leading-relaxed opacity-80">{product.description}</p>
          ) : null}
          <button
            type="button"
            className="mt-8 rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
          >
            Add to cart
          </button>
        </div>
      </div>
      <ProductReviews />
    </div>
  );
}
