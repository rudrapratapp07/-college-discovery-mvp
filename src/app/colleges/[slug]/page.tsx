import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatFees, formatRating } from "@/lib/format";
import { SaveCollegeButton } from "@/components/colleges/save-college-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: { orderBy: { feesINR: "asc" } },
      placements: { orderBy: { year: "desc" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!college) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState title="College not found" description="The college you are looking for does not exist." />
      </div>
    );
  }

  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: college.id,
        },
      },
    });
    isSaved = !!saved;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{college.name}</h1>
          <p className="mt-2 text-slate-600">
            {college.city}, {college.state}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{formatRating(college.rating)} rating</Badge>
            <Badge>{formatFees(college.annualFeesINR)} / year</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <SaveCollegeButton collegeId={college.id} initialSaved={isSaved} />
          <Link
            href={`/compare?ids=${college.id}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Add to compare
          </Link>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-3 leading-relaxed text-slate-700">{college.overview}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Courses</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="py-2 pr-4">Course</th>
                <th className="py-2 pr-4">Degree</th>
                <th className="py-2 pr-4">Duration</th>
                <th className="py-2">Fees</th>
              </tr>
            </thead>
            <tbody>
              {college.courses.map((course) => (
                <tr key={course.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">{course.name}</td>
                  <td className="py-3 pr-4">{course.degree}</td>
                  <td className="py-3 pr-4">{course.durationYears} years</td>
                  <td className="py-3">{formatFees(course.feesINR)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Placements</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {college.placements.map((placement) => (
            <div key={placement.id} className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{placement.year}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                ₹{placement.avgPackageLPA} LPA avg
              </p>
              <p className="text-sm text-slate-600">
                Highest ₹{placement.highestPackageLPA} LPA · {placement.placementPercent}% placed
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
        <div className="mt-4 space-y-4">
          {college.reviews.map((review) => (
            <article key={review.id} className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">{review.authorName}</p>
                <Badge>{review.rating} ★</Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.content}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
