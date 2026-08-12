import { NextResponse } from "next/server";
export async function GET() {
  const key = process.env.RESEND_API_KEY;
  return NextResponse.json({ 
    hasKey: !!key, 
    keyLength: key?.length,
    keyStart: key?.substring(0, 5)
  });
}
