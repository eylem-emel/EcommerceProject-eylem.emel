// src/pages/HomePage.jsx
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col gap-10">
      {/* HERO */}
      <section className="w-full rounded-2xl border border-zinc-200 p-6 sm:p-10 bg-white">
        <div className="max-w-3xl flex flex-col gap-4">
          <h1 className="text-2xl sm:text-4xl font-semibold leading-tight">
            Discover products you’ll love.
          </h1>
          <p className="text-sm sm:text-base text-zinc-600">
            Browse our latest collection. Simple, clean, and fast shopping experience.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/shop"
              className="px-5 py-3 rounded-xl bg-zinc-900 text-white text-sm hover:bg-zinc-800"
            >
              Go to Shop
            </Link>
            <Link
              to="/signup"
              className="px-5 py-3 rounded-xl border border-zinc-200 text-sm hover:bg-zinc-50"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="New Arrivals" desc="Check what’s new this week." to="/shop" />
        <Card title="Popular" desc="Most loved by customers." to="/shop" />
        <Card title="Sale" desc="Best deals, limited time." to="/shop" />
      </section>

      {/* INFO */}
      <section className="w-full rounded-2xl border border-zinc-200 p-6 bg-white">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-semibold">Need help?</div>
            <div className="text-sm text-zinc-600">Reach out from the contact page.</div>
          </div>

          <Link
            to="/contact"
            className="px-4 py-2 rounded-xl border border-zinc-200 text-sm hover:bg-zinc-50 self-start sm:self-auto"
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}

function Card({ title, desc, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-zinc-200 p-5 bg-white hover:bg-zinc-50 transition"
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-sm text-zinc-600 mt-1">{desc}</div>
      <div className="text-sm mt-4 underline">Explore</div>
    </Link>
  );
}
