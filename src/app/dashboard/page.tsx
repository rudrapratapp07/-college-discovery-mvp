import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CollegeCard } from "@/components/colleges/college-card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [savedColleges, savedComparisons] = await Promise.all([
    prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            rating: true,
            annualFeesINR: true,
          },
        },
      },
      orderBy: { savedAt: "desc" },
    }),
    prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { savedAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome back, {session.user.name ?? session.user.email}</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Saved colleges</h2>
        {savedColleges.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No saved colleges"
              description="Browse colleges and save your favorites for later."
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedColleges.map(({ college }) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Saved comparisons</h2>
        {savedComparisons.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No saved comparisons"
              description="Compare colleges and save the results from the compare page."
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {savedComparisons.map((comparison) => (
              <li key={comparison.id}>
                <Link
                  href={`/saved/comparisons/${comparison.id}`}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-indigo-200"
                >
                  <p className="font-medium text-slate-900">{comparison.name ?? "Comparison"}</p>
                  <p className="text-sm text-slate-500">
                    {(comparison.collegeIds as string[]).length} colleges · Saved{" "}
                    {comparison.savedAt.toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
