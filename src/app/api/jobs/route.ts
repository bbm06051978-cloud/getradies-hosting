import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Nearby suburbs map
const nearbySuburbs: Record<string, string[]> = {
  "Parramatta": ["Parramatta", "Westmead", "Harris Park", "North Parramatta", "Granville", "Merrylands", "Wentworthville", "Northmead", "Toongabbie", "Rydalmere", "Ermington", "Dundas"],
  "Westmead": ["Westmead", "Parramatta", "Harris Park", "Northmead", "Wentworthville", "Pendle Hill"],
  "Blacktown": ["Blacktown", "Seven Hills", "Kings Langley", "Marayong", "Pendle Hill", "Toongabbie", "Girraween", "Old Toongabbie", "Winston Hills"],
  "Penrith": ["Penrith", "Kingswood", "Werrington", "St Marys", "Emu Plains", "Leonay", "Glenmore Park"],
  "Liverpool": ["Liverpool", "Casula", "Moorebank", "Chipping Norton", "Miller", "Cabramatta", "Fairfield"],
  "Bankstown": ["Bankstown", "Yagoona", "Greenacre", "Punchbowl", "Roselands", "Bass Hill", "Lakemba", "Wiley Park"],
  "Merrylands": ["Merrylands", "Granville", "Guildford", "Woodville", "Parramatta", "Harris Park"],
  "Granville": ["Granville", "Merrylands", "Guildford", "South Granville", "Parramatta", "Auburn"],
  "Auburn": ["Auburn", "Granville", "Lidcombe", "Berala", "Clyde", "Silverwater"],
  "Ryde": ["Ryde", "Meadowbank", "Ermington", "Eastwood", "Epping", "Carlingford", "Northmead"],
  "Chatswood": ["Chatswood", "Lane Cove", "St Leonards", "Artarmon", "Willoughby", "Roseville"],
  "Hornsby": ["Hornsby", "Waitara", "Wahroonga", "Turramurra", "Pymble", "Gordon", "Beecroft"],
  "Hurstville": ["Hurstville", "Penshurst", "Mortdale", "Oatley", "Beverly Hills", "Narwee"],
  "Sutherland": ["Sutherland", "Jannali", "Kirrawee", "Miranda", "Caringbah", "Cronulla"],
  "Manly": ["Manly", "Dee Why", "Brookvale", "Freshwater", "Curl Curl", "Collaroy"],
  "Bondi": ["Bondi", "Bondi Junction", "Randwick", "Coogee", "Maroubra", "Kingsford"],
  "Newtown": ["Newtown", "Erskineville", "St Peters", "Marrickville", "Petersham", "Stanmore"],
  "Surry Hills": ["Surry Hills", "Darlinghurst", "Paddington", "Redfern", "Chippendale"],
  "Sydney": ["Sydney", "Surry Hills", "Newtown", "Glebe", "Pyrmont", "Ultimo", "Redfern"],
  "North Sydney": ["North Sydney", "Milsons Point", "Kirribilli", "Cremorne", "Neutral Bay"],
  "Strathfield": ["Strathfield", "Burwood", "Flemington", "Homebush", "Concord", "Croydon"],
  "Campbelltown": ["Campbelltown", "Minto", "Ingleburn", "Macquarie Fields", "Airds", "Blair Athol"],
};

function getSuburbsToSearch(suburb: string): string[] {
  if (!suburb) return [suburb];
  if (nearbySuburbs[suburb]) return nearbySuburbs[suburb];
  const key = Object.keys(nearbySuburbs).find(k => k.toLowerCase() === suburb.toLowerCase());
  if (key) return nearbySuburbs[key];
  return [suburb];
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const { title, description, trade, suburb, state, postcode, urgency, budget, preferredDate, aiEstimate } = await req.json();

  if (!title || !description || !trade || !suburb || !state) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      userId: decoded.id,
      title,
      description,
      trade,
      suburb,
      state,
      postcode,
      status: "OPEN",
      aiEstimate: aiEstimate || null,
    },
  });

  // Notify matching tradies about new job lead
  try {
    const suburbsToSearch = getSuburbsToSearch(suburb);

    const matchingTradies = await prisma.tradieProfile.findMany({
      where: {
        specialty: { equals: trade, mode: "insensitive" },
        suburb: { in: suburbsToSearch, mode: "insensitive" } as any,
      },
      include: {
        user: { select: { id: true } },
      },
    });

    if (matchingTradies.length > 0) {
      await prisma.notification.createMany({
        data: matchingTradies.map(t => ({
          userId: t.user.id,
          title: "🔔 New Job Lead!",
          message: `New ${trade} job in ${suburb}: "${title}". Be the first to quote!`,
        })),
      });
    }
  } catch (err) {
    console.error("Failed to send job lead notifications:", err);
  }

  return NextResponse.json({ success: true, job });
}
