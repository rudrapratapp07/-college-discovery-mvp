import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
};

export function Pagination({ page, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (nextPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page") return;
      if (typeof value === "string") params.set(key, value);
    });
    params.set("page", String(nextPage));
    return `/colleges?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Previous
      </Link>
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Next
      </Link>
    </div>
  );
}
