import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatFees, formatRating } from "@/lib/format";

type CollegeCardProps = {
  college: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    rating: number;
    annualFeesINR: number;
  };
};

export function CollegeCard({ college }: CollegeCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-teal-800">
            <Link href={`/colleges/${college.slug}`}>{college.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            {college.city}, {college.state}
          </p>
        </div>
        <Badge variant="rating">{formatRating(college.rating)} ★</Badge>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm">
        <span className="text-stone-500">Annual fees</span>
        <span className="font-semibold text-stone-900">{formatFees(college.annualFeesINR)}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/colleges/${college.slug}`}
          className="flex-1 rounded-lg bg-teal-700 py-2 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          View profile
        </Link>
        <Link
          href={`/compare?ids=${college.id}`}
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-teal-300 hover:text-teal-800"
        >
          Compare
        </Link>
      </div>
    </article>
  );
}
