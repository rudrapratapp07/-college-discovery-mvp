import { prisma } from "@/lib/prisma";
import { saveCollegeSchema } from "@/lib/validations/college";
import { errorResponse, jsonResponse, requireAuth } from "@/lib/api-utils";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session!.user!.id },
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
  });

  return jsonResponse(saved);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = saveCollegeSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const college = await prisma.college.findUnique({
      where: { id: parsed.data.collegeId },
    });

    if (!college) {
      return errorResponse("College not found", 404);
    }

    const saved = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: session!.user!.id,
          collegeId: parsed.data.collegeId,
        },
      },
      update: {},
      create: {
        userId: session!.user!.id,
        collegeId: parsed.data.collegeId,
      },
      include: {
        college: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return jsonResponse(saved, 201);
  } catch {
    return errorResponse("Failed to save college", 500);
  }
}
