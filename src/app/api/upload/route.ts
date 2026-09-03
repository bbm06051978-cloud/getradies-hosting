import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyToken } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// POST — get a pre-signed URL for direct S3 upload
export async function POST(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get("token")?.value;
    const bearerToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const token = cookieToken || bearerToken;
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

    // Initialize S3 client with env vars
    const BUCKET = process.env.GETRADIE_S3_BUCKET || "getradie-documents";
    const s3 = new S3Client({
      region: process.env.GETRADIE_S3_REGION || "ap-southeast-2",
      credentials: {
        accessKeyId: process.env.GETRADIE_S3_KEY_ID || "",
        secretAccessKey: process.env.GETRADIE_S3_SECRET || "",
      },
    });
    console.log("S3 config:", { region: process.env.GETRADIE_S3_REGION, bucket: BUCKET, keyIdExists: !!process.env.GETRADIE_S3_KEY_ID, secretExists: !!process.env.GETRADIE_S3_SECRET });

    // Generate unique key
    const ext = fileName.split(".").pop();
    const folder = documentType === "job_photo" ? `jobs/${decoded.id}` : documentType === "chat_photo" ? `chats/${decoded.id}` : `verification/${decoded.id}`;
    const key = `${folder}/${documentType || "doc"}_${Date.now()}.${ext}`;

    // Generate pre-signed upload URL (valid for 5 minutes)
    const commandParams: any = {
      Bucket: BUCKET,
      Key: key,
      ContentType: fileType,
      Metadata: {
        userId: decoded.id,
        documentType: documentType || "doc",
      },
    };
    if (documentType === "job_photo") {
      commandParams.ACL = "public-read";
    }
    const command = new PutObjectCommand(commandParams);

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    // The public URL after upload
    const publicUrl = `https://${BUCKET}.s3.ap-southeast-2.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("S3 upload error:", err);
    return NextResponse.json({ error: "Failed to generate upload URL." }, { status: 500 });
  }
}
