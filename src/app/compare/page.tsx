import { Suspense } from "react";
import { ComparePageClient } from "@/components/compare/compare-page-client";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Compare colleges</h1>
        <p className="mt-2 text-slate-600">Side-by-side comparison of fees, placements, and ratings.</p>
      </div>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-slate-100" />}>
        <ComparePageClient />
      </Suspense>
    </div>
  );
}
