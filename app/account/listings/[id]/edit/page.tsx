import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOwnedProduct } from "@/lib/products";
import ProductForm from "../../ProductForm";
import { updateListing } from "../../actions";

export default async function EditListingPage(props: PageProps<"/account/listings/[id]/edit">) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await props.params;
  const product = await getOwnedProduct(id, session.user.id);
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/account/listings" className="text-sm opacity-70 hover:text-[#28582e]">
          ← Back to listings
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold">
          Edit listing
        </h1>

        <ProductForm
          action={updateListing}
          submitLabel="Save changes"
          productId={product.id}
          currentImageUrl={product.imageUrl}
          defaults={{
            title: product.title,
            description: product.description ?? "",
            price: (product.priceCents / 100).toFixed(2),
            category: product.category,
          }}
        />
      </div>
    </div>
  );
}
