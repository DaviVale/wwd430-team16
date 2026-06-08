import Link from "next/link";
import { notFound } from "next/navigation";
import { getSellerBySlug } from "@/lib/sellers";
import { listProductsForSellerSlug } from "@/lib/products";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function SellerProfilePage(props: PageProps<"/sellers/[slug]">) {
  const { slug } = await props.params;
  const seller = await getSellerBySlug(slug);

  if (!seller) {
    notFound();
  }

  const products = await listProductsForSellerSlug(slug);

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center gap-6">
          {seller.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={seller.image} alt="" className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="h-24 w-24 rounded-full bg-[#e5e5e5]" />
          )}
          <div>
            <p className="text-sm uppercase tracking-wide opacity-60">Artisan</p>
            <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold">
              {seller.shopName}
            </h1>
            {seller.location ? (
              <p className="mt-1 text-sm opacity-70">{seller.location}</p>
            ) : null}
          </div>
        </div>

        {seller.specialties.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {seller.specialties.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {seller.bio ? (
          <p className="mt-8 max-w-2xl leading-relaxed opacity-80">{seller.bio}</p>
        ) : null}

        {(seller.websiteUrl || seller.instagramUrl) ? (
          <div className="mt-6 flex gap-4 text-sm font-medium text-[#28582e]">
            {seller.websiteUrl ? (
              <a href={seller.websiteUrl} target="_blank" rel="noreferrer" className="hover:underline">
                Website
              </a>
            ) : null}
            {seller.instagramUrl ? (
              <a href={seller.instagramUrl} target="_blank" rel="noreferrer" className="hover:underline">
                Instagram
              </a>
            ) : null}
          </div>
        ) : null}

        <h2 className="mt-12 font-[family-name:var(--font-montserrat)] text-2xl font-semibold">
          Their work
        </h2>
        {products.length === 0 ? (
          <p className="mt-6 opacity-70">This artisan hasn&apos;t listed any products yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-lg border border-black/10 bg-white p-4 transition hover:border-[#28582e]"
              >
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="aspect-square w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-md bg-[#e5e5e5]" />
                )}
                <p className="mt-4 font-semibold group-hover:text-[#28582e]">{product.title}</p>
                <p className="mt-1 font-medium">{formatPrice(product.priceCents)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
