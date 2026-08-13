import Link from "next/link";
import { Suspense } from "react";
import GraphPageClient from "@/components/GraphPageClient";

export default function GraphPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Trip<span className="text-cyan-400">Graph</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Destinations
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            Interactive graph
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Explore travel connections
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Follow relationships between destinations,
            attractions, activities and restaurants.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-[650px] items-center justify-center rounded-3xl border border-white/10 bg-slate-950">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-400">
                  Loading graph...
                </p>
              </div>
            </div>
          }
        >
          <GraphPageClient />
        </Suspense>
      </div>
    </main>
  );
}