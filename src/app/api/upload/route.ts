import { NextRequest } from "next/server";
import crypto from "crypto";
import { fail, handleApiError, ok } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "drl5nidwy";
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) {
      return fail("Cloudinary credentials not configured in environment", 500);
    }

    if (!file) {
      return fail("No image file provided", 400);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file as Blob);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", String(timestamp));
    uploadFormData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadFormData,
    });

    const data = await res.json();
    if (!res.ok) {
      return fail(data.error?.message || "Cloudinary upload failed", 400);
    }

    return ok(
      {
        url: data.secure_url || data.url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
      },
      "Image uploaded successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
