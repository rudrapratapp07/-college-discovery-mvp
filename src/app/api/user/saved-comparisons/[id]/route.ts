import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse, requireAuth } from "@/lib/api-utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await context.params;

    await prisma.savedComparison.deleteMany({
      where: {
        id,
        userId: session!.user!.id,
      },
    });

    return jsonResponse({ success: true });
  } catch {
    return errorResponse("Failed to remove saved comparison", 500);
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await context.params;

    const saved = await prisma.savedComparison.findFirst({
      where: {
        id,
        userId: session!.user!.id,
      },
    });

    if (!saved) {
      return errorResponse("Saved comparison not found", 404);
    }

    const collegeIds = saved.collegeIds as string[];
    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      include: {
        courses: { take: 3 },
        placements: { orderBy: { year: "desc" }, take: 1 },
      },
    });

    const ordered = collegeIds
      .map((collegeId) => colleges.find((college) => college.id === collegeId))
      .filter(Boolean);

    return jsonResponse({ ...saved, colleges: ordered });
  } catch {
    return errorResponse("Failed to fetch saved comparison", 500);
  }
}
