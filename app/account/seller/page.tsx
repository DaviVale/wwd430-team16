import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSellerByUserId } from "@/lib/sellers";
import SellerForm from "./SellerForm";

export default async function SellerAccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const seller = await getSellerByUserId(session.user.id);

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-md px-6 py-12">
        <Link href="/account" className="text-sm opacity-70 hover:text-[#28582e]">
          ← Back to account
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold">
          {seller ? "Your shop" : "Open a shop"}
        </h1>
        <p className="mt-2 opacity-70">
          {seller
            ? "Update the storefront buyers see on your artisan page."
            : "Set up your storefront to start selling on Handcrafted."}
        </p>

        <SellerForm
          isSeller={Boolean(seller)}
          defaults={{
            shopName: seller?.shopName ?? "",
            slug: seller?.slug ?? "",
            tagline: seller?.tagline ?? "",
            bio: seller?.bio ?? "",
            location: seller?.location ?? "",
            specialties: seller?.specialties.join(", ") ?? "",
            websiteUrl: seller?.websiteUrl ?? "",
            instagramUrl: seller?.instagramUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
