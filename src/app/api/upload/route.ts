import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// POST — get a pre-signed URL for direct S3 upload
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { fileName, fileType, fileSize, documentType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "fileName and fileType are required." }, { status: 400 });
    }

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be under 10MB." }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: "Only JPG, PNG and PDF files are allowed." }, { status: 400 });
    }

    // Generate unique key
    const ext = fileName.split(".").pop();
    const key = `verification/${decoded.id}/${documentType || "doc"}_${Date.now()}.${ext}`;

    // Generate pre-signed upload URL (valid for 5 minutes)
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: fileType,
      Metadata: {
        userId: decoded.id,
        documentType: documentType || "doc",
      },
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    // The public URL after upload
    const publicUrl = `https://${BUCKET}.s3.ap-southeast-2.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("S3 upload error:", err);
    return NextResponse.json({ error: "Failed to generate upload URL." }, { status: 500 });
  }
}
