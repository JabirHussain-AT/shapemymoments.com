import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PhotographerLead, Notification, Photographer } from "@/models";
import { photographerLeadSchema } from "@/lib/validations";
import { created, handleApiError, ok } from "@/lib/api";
import { generateRequestId } from "@/lib/utils";

export async function GET() {
  try {
    await connectDB();
    const items = await PhotographerLead.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("photographerId", "name slug")
      .lean();
    return ok(items);
  } catch {
    return ok([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = photographerLeadSchema.parse(await request.json());

    try {
      await connectDB();
      const photographer = await Photographer.findById(data.photographerId);
      const lead = await PhotographerLead.create({
        ...data,
        eventDate: new Date(data.eventDate),
        status: "NEW",
      });

      await Notification.create({
        type: "PHOTOGRAPHER_LEAD",
        title: "New photographer lead",
        message: `${data.name} requested ${photographer?.name || "a photographer"}`,
        link: `/admin/photographer-leads`,
        role: "ADMIN",
      });

      return created({ id: String(lead._id), leadId: generateRequestId("LEAD") });
    } catch {
      return created({
        id: `demo-${Date.now()}`,
        leadId: generateRequestId("LEAD"),
      }, "Lead received (demo mode)");
    }
  } catch (error) {
    return handleApiError(error);
  }
}
