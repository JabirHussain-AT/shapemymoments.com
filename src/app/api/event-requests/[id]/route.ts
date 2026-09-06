import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { EventRequest } from "@/models";
import { eventRequestUpdateSchema } from "@/lib/validations";
import { fail, handleApiError, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await EventRequest.findById(id).lean();
    if (!item) return fail("Event request not found", 404);
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN", "EVENT_MANAGER"]);
    const { id } = await params;
    const body = eventRequestUpdateSchema.parse(await request.json());
    await connectDB();
    const item = await EventRequest.findByIdAndUpdate(id, body, {
      new: true,
    }).lean();
    if (!item) return fail("Event request not found", 404);
    return ok(item, "Event request updated");
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return fail("Unauthorized", 401);
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return fail("Forbidden", 403);
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSession(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    await connectDB();
    const item = await EventRequest.findByIdAndDelete(id);
    if (!item) return fail("Event request not found", 404);
    return ok({ id }, "Event request deleted");
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return fail("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
