import { getCollegeBySlug } from "@/lib/colleges";
import { errorResponse, jsonResponse } from "@/lib/api-utils";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const college = await getCollegeBySlug(slug);

    if (!college) {
      return errorResponse("College not found", 404);
    }

    return jsonResponse(college);
  } catch {
    return errorResponse("Failed to fetch college", 500);
  }
}
