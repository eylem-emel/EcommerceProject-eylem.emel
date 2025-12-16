import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Products", value: "1,200+" },
    { label: "Happy Customers", value: "8,500+" },
    { label: "Countries", value: "18" },
  ];

  const values = [
    {
      icon: BadgeCheck,
      title: "Quality First",
      desc: "We curate products that are built to last and feel great to use.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Reliable shipping with clear tracking and easy returns.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      desc: "Safe payments and privacy-first handling of your data.",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 py-6">
      {/* Hero */}
      <div className="w-full rounded-2xl border border-zinc-200 overflow-hidden flex">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-[55%] p-6 sm:p-10 flex flex-col gap-3">
            <div className="text-xs uppercase tracking-widest text-zinc-500">
              About us
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900">
              Building a simple, clean shopping experience.
            </h1>
            <p className="text-sm text-zinc-600">
              We’re a small team crafting a modern e-commerce experience with a
              focus on usability, speed, and honest design.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button className="px-5 py-3 rounded-xl bg-zinc-900 text-white text-sm">
                Explore Shop
              </button>
              <button className="px-5 py-3 rounded-xl border border-zinc-200 text-sm">
                Contact
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[45%] flex">
            <div className="w-full min-h-[220px] lg:min-h-[320px] bg-zinc-100" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full flex flex-wrap gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="w-full sm:w-[calc(33.333%-0.75rem)] flex"
          >
            <div className="w-full rounded-2xl border border-zinc-200 p-5 flex flex-col gap-1">
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="text-sm text-zinc-600">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">What we care about</h2>
          <p className="text-sm text-zinc-600">
            A few principles that guide our product and service decisions.
          </p>
        </div>

        <div className="w-full flex flex-wrap gap-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] flex"
              >
                <div className="w-full rounded-2xl border border-zinc-200 p-5 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold">{v.title}</div>
                  <div className="text-sm text-zinc-600">{v.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story */}
      <div className="w-full rounded-2xl border border-zinc-200 p-6 sm:p-10 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[45%] flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Our story</h3>
          <p className="text-sm text-zinc-600">
            This project started as a UI kit implementation and grew into a
            reusable layout system with clean, flexible components. The goal is
            to keep the interface fast and the code easy to evolve.
          </p>
        </div>

        <div className="w-full lg:w-[55%] flex flex-col gap-3">
          {[
            ["2025", "Project started with mobile-first layouts."],
            ["2025", "Added shop, product detail, contact, team pages."],
            ["Next", "Cart, auth, and real API integration."],
          ].map(([year, text], i) => (
            <div
              key={i}
              className="w-full flex items-start gap-4 border border-zinc-200 rounded-2xl p-4"
            >
              <div className="text-sm font-semibold w-16">{year}</div>
              <div className="text-sm text-zinc-600">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
