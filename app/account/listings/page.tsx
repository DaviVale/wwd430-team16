import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSellerByUserId } from "@/lib/sellers";
import { listProductsBySeller, categoryLabel } from "@/lib/products";
import DeleteListingButton from "./DeleteListingButton";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function ListingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const seller = await getSellerByUserId(session.user.id);
  const products = seller ? await listProductsBySeller(session.user.id) : [];

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/account" className="text-sm opacity-70 hover:text-[#28582e]">
          ← Back to account
        </Link>
        <div className="mt-4 flex items-center justify-between gap-4">
          <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold">Listings</h1>
          {seller ? (
            <Link
              href="/account/listings/new"
              className="rounded-md bg-[#28582e] px-4 py-2 text-sm font-medium text-[#f8f8f8] hover:opacity-90"
            >
              + New listing
            </Link>
          ) : null}
        </div>

        {!seller ? (
          <div className="mt-10 rounded-lg border border-black/10 bg-white p-6">
            <p className="opacity-80">You need a shop before you can create listings.</p>
            <Link href="/account/seller" className="mt-3 inline-block font-medium text-[#28582e] hover:underline">
              Open a shop →
            </Link>
          </div>
        ) : products.length === 0 ? (
          <p className="mt-10 opacity-70">
            You haven&apos;t listed anything yet. Create your first listing to get started.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 rounded-lg border border-black/10 bg-white p-4"
              >
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt="" className="h-16 w-16 rounded-md object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-[#e5e5e5]" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{product.title}</p>
                  <p className="text-sm opacity-70">
                    {formatPrice(product.priceCents)} · {categoryLabel(product.category)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm font-medium text-[#28582e] hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    href={`/account/listings/${product.id}/edit`}
                    className="text-sm font-medium hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteListingButton id={product.id} title={product.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
