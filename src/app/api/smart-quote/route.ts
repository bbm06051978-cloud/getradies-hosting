import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { verifyToken } from "@/lib/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { jobTitle, jobDescription, trade, suburb, state, aiEstimate } = await req.json();

  const prompt = `You are an expert Australian tradie quoting assistant.

A tradie needs to fill in their quote form for this job:

Job Title: ${jobTitle}
Job Description: ${jobDescription || "Not provided"}
Trade: ${trade}
Location: ${suburb}, ${state}
AI Estimate context: ${aiEstimate || "Not available"}

Generate realistic quote form fields for an Australian tradie. Return ONLY a JSON object with exactly these fields:

{
  "amount": "350",
  "description": "Labour and materials included. Will replace faulty tap washer and test water pressure. All work guaranteed. Tidy up included.",
  "availability": "Within 2 business days",
  "warranty": "12 months parts and labour warranty"
}

Rules:
- amount: realistic AUD price as a number string only (no $ sign, no range, single fixed price)
- description: 2-3 sentences describing what is included, professional tone, specific to the job
- availability: must be exactly one of these values: "Available Today", "Available Tomorrow", "Available This Week", "Available Next Week", "Flexible"  
- warranty: specific warranty statement e.g. "12 months parts and labour" or "6 months workmanship guarantee"
- All values must be strings
- Return ONLY the JSON, no other text`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 300,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content || "{}";
    const data = JSON.parse(text);

    // Validate all fields present
    if (!data.amount || !data.description || !data.availability || !data.warranty) {
      return NextResponse.json({ error: "Incomplete response from AI. Please try again." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Smart quote error:", err);
    return NextResponse.json({ error: "Failed to generate quote. Please try again." }, { status: 500 });
  }
}
