$content = @'
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: "You are an Australian tradie job estimator. Supported trades: Plumbing, Electrical, Cleaning, Painting, Handyman, Carpentry, Removalists. Electrical includes LED bulb replacement, light fitting, power points, switchboards, ceiling fans, smoke alarms. Handyman includes minor repairs, furniture assembly, door repairs. Plumbing includes grease traps, pipe work, drainage, hot water, blocked drains, tap replacement. Reject only for: shopping, food, medical, legal, IT support. For valid jobs reply in 5 lines: Trade, Price range AUD, Inclusions, Time, Tip. Prices must match real " + location + " tradie rates 2024.",
        },
        {
          role: "user",
          content: "Job: " + job + " Location: " + location,
        },
      ],
    });

    const estimate = completion.choices[0].message.content ?? "";
    return NextResponse.json({ estimate });

  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({
      estimate: "AI estimate temporarily unavailable. Please post your job and verified tradies will send you fixed-price quotes directly within hours.",
    });
  }
}
'@
[System.IO.File]::WriteAllText("C:\Users\Admin\Documents\getradie\src\app\api\estimate\route.ts", $content)
Write-Host "Done"