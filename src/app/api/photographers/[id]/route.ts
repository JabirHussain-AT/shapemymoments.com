import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Photographer } from "@/models";
import { fail, handleApiError, ok } from "@/lib/api";
import { getDemoPhotographer } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      await connectDB();
      const item =
        (await Photographer.findOne({ slug: id }).lean()) ||
        (await Photographer.findById(id).lean());
      if (!item) return fail("Photographer not found", 404);
      return ok(item);
    } catch {
      const demo = getDemoPhotographer(id);
      if (!demo) return fail("Photographer not found", 404);
      return ok(demo);
    }
  } catch (error) {
    return handleApiError(error);
  }
}
