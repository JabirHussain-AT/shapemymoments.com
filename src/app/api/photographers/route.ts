import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Photographer } from "@/models";
import { photographerFilterSchema } from "@/lib/validations";
import { handleApiError, ok } from "@/lib/api";
import { getDemoPhotographers } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const filters = photographerFilterSchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    );

    try {
      await connectDB();
      const query: Record<string, unknown> = { status: "APPROVED" };

      if (filters.q) {
        query.$or = [
          { name: { $regex: filters.q, $options: "i" } },
          { location: { $regex: filters.q, $options: "i" } },
          { specializations: { $regex: filters.q, $options: "i" } },
        ];
      }
      if (filters.location) {
        query.$or = [
          { location: { $regex: filters.location, $options: "i" } },
          { serviceLocations: { $regex: filters.location, $options: "i" } },
        ];
      }
      if (filters.eventType) query.eventTypes = filters.eventType;
      if (filters.minExperience)
        query.yearsOfExperience = { $gte: filters.minExperience };
      if (filters.maxPrice) query.startingPrice = { $lte: filters.maxPrice };
      if (filters.minRating) query.rating = { $gte: filters.minRating };
      if (filters.availability) query.availability = filters.availability;

      let sort: Record<string, 1 | -1> = { featured: -1, rating: -1 };
      if (filters.sort === "rating") sort = { rating: -1 };
      if (filters.sort === "experience") sort = { yearsOfExperience: -1 };
      if (filters.sort === "price-asc") sort = { startingPrice: 1 };
      if (filters.sort === "price-desc") sort = { startingPrice: -1 };
      if (filters.sort === "featured") sort = { featured: -1 };

      const skip = (filters.page - 1) * filters.limit;
      const [items, total] = await Promise.all([
        Photographer.find(query).sort(sort).skip(skip).limit(filters.limit).lean(),
        Photographer.countDocuments(query),
      ]);

      return ok({ items, total, page: filters.page, limit: filters.limit });
    } catch {
      const items = getDemoPhotographers(filters);
      return ok({
        items,
        total: items.length,
        page: filters.page,
        limit: filters.limit,
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
