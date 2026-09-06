import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage, Notification, SiteSettings } from "@/models";
import { contactSchema, notifySchema } from "@/lib/validations";
import { created, handleApiError, ok } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.interest) {
      const data = notifySchema.parse(body);
      try {
        await connectDB();
        await SiteSettings.findOneAndUpdate(
          {},
          {
            $push: {
              notifyEmails: {
                email: data.email,
                interest: data.interest,
                createdAt: new Date(),
              },
            },
          },
          { upsert: true }
        );
      } catch {
        // demo ok
      }
      return created({ email: data.email }, "You'll be notified when we launch");
    }

    const data = contactSchema.parse(body);
    try {
      await connectDB();
      const doc = await ContactMessage.create({ ...data, status: "NEW" });
      await Notification.create({
        type: "CONTACT_MESSAGE",
        title: "New contact message",
        message: `${data.name}: ${data.message.slice(0, 80)}`,
        role: "ADMIN",
        link: "/admin/contact",
      });
      return created({ id: String(doc._id) }, "Message sent");
    } catch {
      return created({ id: `demo-${Date.now()}` }, "Message sent (demo mode)");
    }
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    await connectDB();
    const items = await ContactMessage.find().sort({ createdAt: -1 }).limit(100).lean();
    return ok(items);
  } catch {
    return ok([]);
  }
}
