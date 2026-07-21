import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { job, location = "Sydney, NSW" } = await req.json();

  if (!job || job.trim().length < 3) {
    return NextResponse.json(
      { error: "Please describe your job first." },
      { status: 400 }
    );
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 150,
    messages: [
      {
        role: "system",
        content: `You are an Australian tradie job estimator. You ONLY estimate jobs that require a licensed or skilled tradie to physically come to a property and perform work.

Supported trades ONLY: Plumbing, Electrical, Cleaning, Painting, Handyman, Carpentry, Removalists.

STRICT REJECTION RULES - reply ONLY "❌ This is not a tradie job. We only estimate Plumbing, Electrical, Cleaning, Painting, Handyman, Carpentry and Removalist jobs." for ANY of these:
- Shopping, buying, or purchasing anything
- Food, cooking, recipes
- Medical, legal, financial advice
- IT, software, computers
- Anything that does not require a tradie at a property
- Any job outside the 7 supported trades

If the job IS a valid tradie job, reply in EXACTLY 5 lines with no extra text:
🔧 Trade: [one of: Plumbing, Electrical, Cleaning, Painting, Handyman, Carpentry, Removalists]
💰 $[tight min] – $[tight max] AUD
✅ [exact item 1], [exact item 2], [exact item 3]
⏱ [specific time e.g. 45 mins, 2 hrs, half day]
💡 [job-specific money-saving tip under 10 words]

Prices must match real ${location} tradie rates in 2024. Be specific to the exact job. No extra text.`,
      },
      {
        role: "user",
        content: `Job: ${job}\nLocation: ${location}`,
      },
    ],
  });

  const estimate = completion.choices[0].message.content ?? "";

  // Only save to DB if it's a valid estimate, not a rejection,
  // and not called from the post-job page (which saves its own record)
  

  return NextResponse.json({ estimate });
}
