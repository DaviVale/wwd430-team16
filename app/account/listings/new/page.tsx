import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSellerByUserId } from "@/lib/sellers";
import ProductForm from "../ProductForm";
import { createListing } from "../actions";

export default async function NewListingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const seller = await getSellerByUserId(session.user.id);
  if (!seller) {
    redirect("/account/seller");
  }

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/account/listings" className="text-sm opacity-70 hover:text-[#28582e]">
          ← Back to listings
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold">
          New listing
        </h1>
        <p className="mt-2 opacity-70">Add a product to your shop.</p>

        <ProductForm action={createListing} submitLabel="Publish listing" />
      </div>
    </div>
  );
}
