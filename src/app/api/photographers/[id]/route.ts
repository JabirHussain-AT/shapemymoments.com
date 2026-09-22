import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Photographer } from "@/models";
import { fail, handleApiError, ok } from "@/lib/api";

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
      return fail("Photographer not found", 404);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectDB();
    const isObjectId = Boolean(id.match(/^[0-9a-fA-F]{24}$/));
    const query = isObjectId ? { _id: id } : { slug: id };

    const updated = await Photographer.findOneAndUpdate(query, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return fail("Creative partner profile not found", 404);
    }

    return ok(updated, "Partner profile updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
