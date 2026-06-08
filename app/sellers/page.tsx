import Link from "next/link";
import { listSellers } from "@/lib/sellers";

export default async function SellersPage() {
  const sellers = await listSellers();

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Artisans</h1>
        <p className="mt-2 opacity-70">Meet the makers behind every piece.</p>

        {sellers.length === 0 ? (
          <p className="mt-10 opacity-70">No artisans have opened a shop yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {sellers.map((seller) => (
              <Link
                key={seller.slug}
                href={`/sellers/${seller.slug}`}
                className="rounded-lg border border-black/10 bg-white p-6 hover:border-[#28582e]"
              >
                {seller.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={seller.image}
                    alt=""
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-[#e5e5e5]" />
                )}
                <h3 className="mt-4 font-semibold">{seller.shopName}</h3>
                {seller.tagline ? (
                  <p className="text-sm opacity-70">{seller.tagline}</p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
