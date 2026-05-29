import { prisma } from "@/lib/prisma";
import { saveComparisonSchema } from "@/lib/validations/college";
import { errorResponse, jsonResponse, requireAuth } from "@/lib/api-utils";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const saved = await prisma.savedComparison.findMany({
    where: { userId: session!.user!.id },
    orderBy: { savedAt: "desc" },
  });

  return jsonResponse(saved);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = saveComparisonSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: parsed.data.collegeIds } },
      select: { id: true, name: true },
    });

    if (colleges.length !== parsed.data.collegeIds.length) {
      return errorResponse("One or more colleges were not found", 404);
    }

    const saved = await prisma.savedComparison.create({
      data: {
        userId: session!.user!.id,
        collegeIds: parsed.data.collegeIds,
        name:
          parsed.data.name ??
          colleges.map((college) => college.name.split(" ")[0]).join(" vs "),
      },
    });

    return jsonResponse(saved, 201);
  } catch {
    return errorResponse("Failed to save comparison", 500);
  }
}
