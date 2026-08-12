import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ 
    hasResend: !!process.env.RESEND_API_KEY,
    hasDB: !!process.env.DATABASE_URL,
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    resendStart: process.env.RESEND_API_KEY?.substring(0, 8),
    dbStart: process.env.DATABASE_URL?.substring(0, 20),
    openAIStart: process.env.OPENAI_API_KEY?.substring(0, 8),
  });
}