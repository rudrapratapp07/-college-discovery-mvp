import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse, requireAuth } from "@/lib/api-utils";

type RouteContext = {
  params: Promise<{ collegeId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { collegeId } = await context.params;

    await prisma.savedCollege.deleteMany({
      where: {
        userId: session!.user!.id,
        collegeId,
      },
    });

    return jsonResponse({ success: true });
  } catch {
    return errorResponse("Failed to remove saved college", 500);
  }
}
