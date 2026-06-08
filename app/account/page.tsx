import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Your account</h1>
        <p className="mt-2 opacity-70">Manage your profile, orders, and preferences.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link href="/account/orders" className="rounded-lg border border-black/10 bg-white p-6 hover:border-[#28582e]">
            <h2 className="font-semibold">Orders</h2>
            <p className="text-sm opacity-70">View past purchases and track shipments.</p>
          </Link>
          <Link href="/account/profile" className="rounded-lg border border-black/10 bg-white p-6 hover:border-[#28582e]">
            <h2 className="font-semibold">Profile</h2>
            <p className="text-sm opacity-70">Update your name, email, and shipping address.</p>
          </Link>
          <Link href="/account/seller" className="rounded-lg border border-black/10 bg-white p-6 hover:border-[#28582e]">
            <h2 className="font-semibold">Sell on Handcrafted</h2>
            <p className="text-sm opacity-70">Open a shop and edit your artisan storefront.</p>
          </Link>
          <Link href="/account/listings" className="rounded-lg border border-black/10 bg-white p-6 hover:border-[#28582e]">
            <h2 className="font-semibold">Listings</h2>
            <p className="text-sm opacity-70">Add, edit, and remove your product listings.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
