import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, Photographer, Subscription, Notification } from "@/models";
import { loginSchema, registerSchema } from "@/lib/validations";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
  getSession,
} from "@/lib/auth";
import { created, fail, handleApiError, ok } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { PLAN_FEATURES, PLAN_PRICES } from "@/models/Subscription";

export async function GET() {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  return ok(session);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "logout") {
      await clearSessionCookie();
      return ok({ loggedOut: true });
    }

    if (action === "login") {
      const data = loginSchema.parse(body);

      // Demo admin / accounts without DB
      if (
        data.email === "admin@shapemymoment.com" &&
        data.password === "admin12345"
      ) {
        const token = await createSessionToken({
          id: "demo-admin",
          email: data.email,
          name: "Admin",
          role: "ADMIN",
        });
        await setSessionCookie(token);
        return ok({
          user: {
            id: "demo-admin",
            email: data.email,
            name: "Admin",
            role: "ADMIN",
          },
        });
      }

      if (
        data.email === "demo@shapemymoment.com" &&
        data.password === "demo12345"
      ) {
        const token = await createSessionToken({
          id: "demo-customer",
          email: data.email,
          name: "Demo Customer",
          role: "CUSTOMER",
        });
        await setSessionCookie(token);
        return ok({
          user: {
            id: "demo-customer",
            email: data.email,
            name: "Demo Customer",
            role: "CUSTOMER",
          },
        });
      }

      try {
        await connectDB();
        const user = await User.findOne({ email: data.email }).select("+passwordHash");
        if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
          return fail("Invalid email or password", 401);
        }
        if (!user.isActive) return fail("Account suspended", 403);

        let photographerId: string | undefined;
        if (user.role === "PHOTOGRAPHER") {
          const photographerDoc = (await Photographer.findOne({
            userId: user._id,
          })
            .select("_id")
            .lean()) as { _id: unknown } | null;
          if (photographerDoc) {
            photographerId = String(photographerDoc._id);
          }
        }

        const sessionUser = {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
          photographerId,
        };
        const token = await createSessionToken(sessionUser);
        await setSessionCookie(token);
        return ok({ user: sessionUser });
      } catch {
        return fail("Invalid email or password", 401);
      }
    }

    if (action === "register") {
      const data = registerSchema.parse(body);

      try {
        await connectDB();
        const exists = await User.findOne({ email: data.email });
        if (exists) return fail("Email already registered", 409);

        const passwordHash = await hashPassword(data.password);
        const user = await User.create({
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          role: data.role,
        });

        if (data.role === "PHOTOGRAPHER") {
          const photographer = await Photographer.create({
            userId: user._id,
            slug: slugify(data.name) + "-" + Date.now().toString(36),
            name: data.name,
            profilePhoto:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
            coverImage:
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80",
            location: "Pending",
            bio: "New photographer profile — complete your details in the dashboard.",
            experience: "Update your experience",
            yearsOfExperience: 1,
            specializations: [],
            eventTypes: [],
            portfolio: [],
            startingPrice: 0,
            languages: ["English"],
            serviceLocations: [],
            availability: "Available",
            packages: [],
            verified: false,
            featured: false,
            status: "PENDING",
            subscriptionPlan: "FREE",
          });

          await Subscription.create({
            photographerId: photographer._id,
            userId: user._id,
            plan: "FREE",
            status: "ACTIVE",
            priceMonthly: PLAN_PRICES.FREE,
            features: PLAN_FEATURES.FREE,
          });

          await Notification.create({
            type: "PHOTOGRAPHER_REGISTRATION",
            title: "New photographer registration",
            message: `${data.name} registered as a photographer`,
            role: "ADMIN",
            link: "/admin/photographers",
          });
        }

        const sessionUser = {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
        const token = await createSessionToken(sessionUser);
        await setSessionCookie(token);
        return created({ user: sessionUser }, "Account created");
      } catch (dbError) {
        console.warn(dbError);
        // Demo register fallback
        const sessionUser = {
          id: `demo-${Date.now()}`,
          email: data.email,
          name: data.name,
          role: data.role,
        };
        const token = await createSessionToken(sessionUser);
        await setSessionCookie(token);
        return created({ user: sessionUser }, "Account created (demo mode)");
      }
    }

    return fail("Unknown action");
  } catch (error) {
    return handleApiError(error);
  }
}
