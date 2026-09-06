import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { EventRequest, Notification } from "@/models";
import { eventRequestSchema } from "@/lib/validations";
import { created, handleApiError, ok } from "@/lib/api";
import { generateRequestId } from "@/lib/utils";
import { getDemoEventRequests } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status");

    try {
      await connectDB();
      const query = status ? { status } : {};
      const items = await EventRequest.find(query).sort({ createdAt: -1 }).limit(100).lean();
      return ok(items);
    } catch {
      const demo = getDemoEventRequests().filter((r) =>
        status ? r.status === status : true
      );
      return ok(demo);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = eventRequestSchema.parse(body);
    const requestId = generateRequestId();

    try {
      await connectDB();
      const doc = await EventRequest.create({
        ...data,
        eventDate: new Date(data.eventDate),
        requestId,
        status: "NEW",
      });

      await Notification.create({
        type: "EVENT_REQUEST",
        title: "New event request",
        message: `${data.name} requested a ${data.eventType} in ${data.location}`,
        link: `/admin/event-requests/${doc._id}`,
        role: "ADMIN",
        meta: { requestId },
      });

      return created({ requestId: doc.requestId, id: String(doc._id) });
    } catch (dbError) {
      // Demo fallback when MongoDB is unavailable
      console.warn("DB unavailable, returning demo success", dbError);
      return created({ requestId, id: `demo-${requestId}` }, "Request received (demo mode)");
    }
  } catch (error) {
    return handleApiError(error);
  }
}
