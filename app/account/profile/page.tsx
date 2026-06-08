import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { query } from "@/lib/db";
import ProfileForm from "./ProfileForm";

type UserRow = {
  name: string | null;
  email: string | null;
  shippingAddress: string | null;
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const result = await query<UserRow>(
    `select name, email, "shippingAddress" from users where id = $1`,
    [session.user.id],
  );
  const user = result.rows[0];

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-md px-6 py-12">
        <Link href="/account" className="text-sm opacity-70 hover:text-[#28582e]">
          ← Back to account
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-montserrat)] text-3xl font-bold">
          Profile
        </h1>
        <p className="mt-2 opacity-70">Update your name, email, and shipping address.</p>

        <ProfileForm
          defaultName={user?.name ?? session.user.name ?? ""}
          defaultEmail={user?.email ?? session.user.email ?? ""}
          defaultShippingAddress={user?.shippingAddress ?? ""}
        />
      </div>
    </div>
  );
}
