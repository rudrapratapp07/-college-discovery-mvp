import { listColleges } from "@/lib/colleges";
import { errorResponse, jsonResponse } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const result = await listColleges(params);
    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch colleges";
    return errorResponse(message, 400);
  }
}
