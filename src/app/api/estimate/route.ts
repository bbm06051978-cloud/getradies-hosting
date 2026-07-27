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
        { role: "system", content: "You are an Australian tradie job cost estimator. Always provide estimates for any home maintenance or trade job including quantities. Trades: Electrical, Plumbing, Cleaning, Painting, Carpentry, Handyman, Removalists. Only reject non-property jobs like online shopping. Reply in exactly 5 lines with emoji: line1 trade emoji + trade name, line2 dollar sign + price AUD, line3 checkmark + inclusions, line4 clock + time, line5 lightbulb + saving tip. Use real " + location + " tradie rates 2024." },
        { role: "user", content: "Estimate cost for: " + job },
      ],
    });
    return NextResponse.json({ estimate: completion.choices[0].message.content ?? "" });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ estimate: "AI estimate temporarily unavailable. Please post your job and tradies will quote directly." });
  }
}
