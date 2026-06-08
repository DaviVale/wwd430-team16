import Link from "next/link";

export default function SellPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold md:text-5xl">
          Sell your handmade work.
        </h1>
        <p className="mt-6 max-w-xl text-lg opacity-80">
          Reach buyers who care about craft. Open a shop and start listing in minutes.
        </p>
        <Link
          href="/account/seller"
          className="mt-8 inline-block rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
        >
          Get started
        </Link>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { title: "Low fees", body: "Keep more of what you earn with transparent pricing." },
            { title: "Built-in audience", body: "Buyers come here looking for handmade goods." },
            { title: "Simple tools", body: "List items, manage orders, and ship — all in one place." },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border border-black/10 bg-white p-6">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm opacity-70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
