import { Suspense } from "react";
import { listColleges, getDistinctStates } from "@/lib/colleges";
import { CollegeCard } from "@/components/colleges/college-card";
import { FilterBar } from "@/components/colleges/filter-bar";
import { Pagination } from "@/components/colleges/pagination";
import { EmptyState } from "@/components/ui/empty-state";

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [result, states] = await Promise.all([listColleges(params), getDistinctStates()]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Browse colleges</h1>
        <p className="mt-2 text-slate-600">
          {result.meta.total} colleges found — filter by location, fees, and rating.
        </p>
      </div>
      <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-slate-100" />}>
        <FilterBar states={states} />
      </Suspense>
      {result.colleges.length === 0 ? (
        <EmptyState
          title="No colleges match your filters"
          description="Try adjusting search terms or removing some filters."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
          <Pagination
            page={result.meta.page}
            totalPages={result.meta.totalPages}
            searchParams={params}
          />
        </>
      )}
    </div>
  );
}
