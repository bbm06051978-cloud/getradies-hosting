import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyToken } from "@/lib/auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET || "getradie-documents";

// POST — generate pre-signed GET URL for a document
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const { key } = await req.json();
    if (!key) return NextResponse.json({ error: "Document key is required." }, { status: 400 });

    // Extract S3 key from full URL if needed
    const s3Key = key.includes("amazonaws.com") 
      ? key.split(".amazonaws.com/")[1] 
      : key;

    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
    });

    // Pre-signed URL valid for 15 minutes
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

    return NextResponse.json({ signedUrl });
  } catch (err) {
    console.error("Signed URL error:", err);
    return NextResponse.json({ error: "Failed to generate document URL." }, { status: 500 });
  }
}
