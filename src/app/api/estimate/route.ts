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
  const referer = req.headers.get("referer") || "";
  const isFromPostJob = referer.includes("/post-job");

  if (!estimate.startsWith("❌") && !isFromPostJob) {
    try {
      // Check if user is logged in
      const token = req.cookies.get("token")?.value;
      const user = token ? verifyToken(token) : null;

      // Extract trade directly from AI response
      let detectedTrade = "General";
      const tradeLine = estimate
        .split("\n")
        .find((line) => line.startsWith("🔧"));
      if (tradeLine) {
        detectedTrade = tradeLine.replace("🔧 Trade:", "").trim();
      }

      // Parse suburb and state from location
      // Handle formats like "Parramatta, New South Wales 2150" or "Parramatta, NSW"
      const locationParts = location.split(",");
      const suburb = locationParts[0]?.trim() || "Unknown";
      const rawState = locationParts[1]?.trim() || "NSW";
      // Extract just the state abbreviation - remove postcode
      const stateMap: Record<string, string> = {
        "New South Wales": "NSW",
        "Victoria": "VIC",
        "Queensland": "QLD",
        "Western Australia": "WA",
        "South Australia": "SA",
        "Tasmania": "TAS",
        "Australian Capital Territory": "ACT",
        "Northern Territory": "NT",
      };
      const stateClean = rawState.replace(/\d+/g, "").trim();
      const state = stateMap[stateClean] || stateClean.split(" ")[0] || "NSW";

      if (user) {
        // Logged in — save to their account
        await prisma.job.create({
          data: {
            userId: user.id,
            title: job,
            description: job,
            trade: detectedTrade,
            suburb,
            state,
            aiEstimate: estimate,
            status: "OPEN",
          },
        });
      } else {
        // Not logged in — save as guest using a system user
        let guestUser = await prisma.user.findUnique({
          where: { email: "guest@getradie.com.au" },
        });

        if (!guestUser) {
          guestUser = await prisma.user.create({
            data: {
              name: "Guest",
              email: "guest@getradie.com.au",
              passwordHash: "guest",
              role: "HOMEOWNER",
            },
          });
        }

        await prisma.job.create({
          data: {
            userId: guestUser.id,
            title: job,
            description: job,
            trade: detectedTrade,
            suburb,
            state,
            aiEstimate: estimate,
            status: "OPEN",
          },
        });
      }
    } catch (err) {
      // Don't fail the request if DB save fails
      console.error("Failed to save estimate to DB:", err);
    }
  }

  return NextResponse.json({ estimate });
}