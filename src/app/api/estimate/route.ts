import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { job, location = "Sydney, NSW" } = await req.json();
  if (!job || job.trim().length < 3) {
    return NextResponse.json({ error: "Please describe your job first." }, { status: 400 });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 200,
      messages: [
        { role: "system", content: "You are an Australian tradie job cost estimator. Always provide estimates for any home maintenance or trade job including quantities like 3 bulbs or 2 rooms. Trades: Electrical, Plumbing, Cleaning, Painting, Carpentry, Handyman, Removalists. Only reject non-property jobs like online shopping. Reply in exactly 5 lines with these emoji prefixes: Line 1 start with trade emoji and trade name. Line 2 start with dollar sign and price range AUD. Line 3 start with checkmark and what is included. Line 4 start with clock emoji and time estimate. Line 5 start with lightbulb emoji and one money saving tip. Use real " + location + " tradie rates 2024." },
        { role: "user", content: "Estimate cost for: " + job },
      ],
    });
    return NextResponse.json({ estimate: completion.choices[0].message.content ?? "" });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ estimate: "AI estimate temporarily unavailable. Please post your job and tradies will quote directly." });
  }
}
