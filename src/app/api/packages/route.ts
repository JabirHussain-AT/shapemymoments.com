import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { EventPackage } from "@/models";
import { packageSchema } from "@/lib/validations";
import { created, fail, handleApiError, ok } from "@/lib/api";
import { getDemoPackages } from "@/lib/data";
import { slugify } from "@/lib/utils";
import { requireSession } from "@/lib/auth";

export async function GET() {
  try {
    try {
      await connectDB();
      const items = await EventPackage.find({ active: true }).sort({ startingPrice: 1 }).lean();
      return ok(items);
    } catch {
      // fallback
    }
    return ok(getDemoPackages());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const data = packageSchema.parse(await request.json());
    await connectDB();
    const slug = data.slug || slugify(data.name);
    const exists = await EventPackage.findOne({ slug });
    if (exists) return fail("Package slug already exists", 409);
    const doc = await EventPackage.create({ ...data, slug });
    return created(doc);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return fail("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
