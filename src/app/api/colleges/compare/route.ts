import { getCollegesForCompare } from "@/lib/colleges";
import { compareQuerySchema } from "@/lib/validations/college";
import { errorResponse, jsonResponse } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = compareQuerySchema.safeParse({ ids: searchParams.get("ids") ?? "" });

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid compare request");
    }

    const colleges = await getCollegesForCompare(parsed.data.ids);

    if (colleges.length !== parsed.data.ids.length) {
      return errorResponse("One or more colleges were not found", 404);
    }

    return jsonResponse({ colleges });
  } catch {
    return errorResponse("Failed to compare colleges", 500);
  }
}
