import { NextResponse } from "next/server";
import { getLiveCreativesFromDb } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const creatives = await getLiveCreativesFromDb();
    return NextResponse.json(
      { success: true, data: creatives },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch live creatives",
      },
      { status: 500 }
    );
  }
}
