import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CompareTable } from "@/components/compare/compare-table";

export default async function SavedComparisonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id } = await params;

  const saved = await prisma.savedComparison.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!saved) notFound();

  const collegeIds = saved.collegeIds as string[];
  const colleges = await prisma.college.findMany({
    where: { id: { in: collegeIds } },
    include: {
      courses: { take: 3, orderBy: { feesINR: "asc" } },
      placements: { orderBy: { year: "desc" }, take: 1 },
    },
  });

  const ordered = collegeIds
    .map((collegeId) => colleges.find((college) => college.id === collegeId))
    .filter((college): college is NonNullable<typeof college> => college !== undefined);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{saved.name ?? "Saved comparison"}</h1>
          <p className="mt-2 text-slate-600">Saved on {saved.savedAt.toLocaleDateString()}</p>
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-indigo-700 hover:underline">
          Back to dashboard
        </Link>
      </div>
      <CompareTable colleges={ordered} />
    </div>
  );
}
