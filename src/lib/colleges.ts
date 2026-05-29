import { Prisma } from "../generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { collegeListQuerySchema } from "@/lib/validations/college";

export async function listColleges(searchParams: Record<string, string | string[] | undefined>) {
  const raw = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );

  const parsed = collegeListQuerySchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid query parameters");
  }

  const { q, state, minFees, maxFees, minRating, page, limit, sort, order } = parsed.data;

  const where: Prisma.CollegeWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { state: { contains: q, mode: "insensitive" } },
    ];
  }

  if (state) {
    where.state = { equals: state, mode: "insensitive" };
  }

  if (minFees !== undefined || maxFees !== undefined) {
    where.annualFeesINR = {};
    if (minFees !== undefined) where.annualFeesINR.gte = minFees;
    if (maxFees !== undefined) where.annualFeesINR.lte = maxFees;
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sort === "fees"
      ? { annualFeesINR: order }
      : sort === "name"
        ? { name: order }
        : { rating: order };

  const skip = (page - 1) * limit;

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true,
        rating: true,
        annualFeesINR: true,
        logoUrl: true,
      },
    }),
    prisma.college.count({ where }),
  ]);

  return {
    colleges,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCollegeBySlug(slug: string) {
  return prisma.college.findUnique({
    where: { slug },
    include: {
      courses: { orderBy: { feesINR: "asc" } },
      placements: { orderBy: { year: "desc" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function getCollegesForCompare(ids: string[]) {
  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: {
      courses: { take: 3, orderBy: { feesINR: "asc" } },
      placements: { orderBy: { year: "desc" }, take: 1 },
      reviews: { take: 5, orderBy: { createdAt: "desc" } },
    },
  });

  return ids
    .map((id) => colleges.find((college) => college.id === id))
    .filter((college): college is NonNullable<typeof college> => college !== undefined);
}

export async function getDistinctStates() {
  const states = await prisma.college.findMany({
    distinct: ["state"],
    select: { state: true },
    orderBy: { state: "asc" },
  });
  return states.map((item) => item.state);
}