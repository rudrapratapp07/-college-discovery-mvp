import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status });
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, error: errorResponse("Unauthorized", 401) };
  }
  return { session, error: null };
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
