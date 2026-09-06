import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: string;
  details?: unknown;
};

export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    { success: true, data, message } satisfies ApiSuccess<T>,
    { status }
  );
}

export function created<T>(data: T, message = "Created successfully") {
  return ok(data, message, 201);
}

export function fail(error: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error, details } satisfies ApiError,
    { status }
  );
}

export function handleApiError(error: unknown) {
  console.error(error);

  if (error instanceof ZodError) {
    return fail("Validation failed", 400, error.flatten());
  }

  if (error instanceof Error) {
    if (error.message.includes("MONGODB_URI")) {
      return fail("Database is not configured", 503);
    }
    return fail(error.message || "Internal server error", 500);
  }

  return fail("Internal server error", 500);
}
