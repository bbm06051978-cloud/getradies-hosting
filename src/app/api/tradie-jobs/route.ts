import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Nearby suburbs map for Western Sydney and greater Sydney
const nearbySuburbs: Record<string, string[]> = {
  "Parramatta": ["Parramatta", "Westmead", "Harris Park", "North Parramatta", "Granville", "Merrylands", "Wentworthville", "Northmead", "Toongabbie", "Rydalmere", "Ermington", "Dundas"],
  "Westmead": ["Westmead", "Parramatta", "Harris Park", "Northmead", "Wentworthville", "Pendle Hill"],
  "Blacktown": ["Blacktown", "Seven Hills", "Kings Langley", "Marayong", "Pendle Hill", "Toongabbie", "Girraween", "Old Toongabbie", "Winston Hills"],
  "Penrith": ["Penrith", "Kingswood", "Werrington", "St Marys", "Emu Plains", "Leonay", "Glenmore Park"],
  "Liverpool": ["Liverpool", "Casula", "Moorebank", "Chipping Norton", "Miller", "Cabramatta", "Fairfield"],
  "Bankstown": ["Bankstown", "Yagoona", "Greenacre", "Punchbowl", "Roselands", "Bass Hill", "Lakemba", "Wiley Park"],
  "Campbelltown": ["Campbelltown", "Minto", "Ingleburn", "Macquarie Fields", "Airds", "Blair Athol"],
  "Ryde": ["Ryde", "Meadowbank", "Ermington", "Eastwood", "Epping", "Carlingford", "Northmead"],
  "Chatswood": ["Chatswood", "Lane Cove", "St Leonards", "Artarmon", "Willoughby", "Roseville"],
  "Hornsby": ["Hornsby", "Waitara", "Wahroonga", "Turramurra", "Pymble", "Gordon", "Beecroft"],
  "Merrylands": ["Merrylands", "Granville", "Guildford", "Woodville", "Parramatta", "Harris Park"],
  "Granville": ["Granville", "Merrylands", "Guildford", "South Granville", "Parramatta", "Auburn"],
  "Auburn": ["Auburn", "Granville", "Lidcombe", "Berala", "Clyde", "Silverwater"],
  "Strathfield": ["Strathfield", "Burwood", "Flemington", "Homebush", "Concord", "Croydon"],
  "Hurstville": ["Hurstville", "Penshurst", "Mortdale", "Oatley", "Beverly Hills", "Narwee"],
  "Sutherland": ["Sutherland", "Jannali", "Kirrawee", "Miranda", "Caringbah", "Cronulla"],
  "Manly": ["Manly", "Dee Why", "Brookvale", "Freshwater", "Curl Curl", "Collaroy"],
  "Bondi": ["Bondi", "Bondi Junction", "Randwick", "Coogee", "Maroubra", "Kingsford"],
  "Newtown": ["Newtown", "Erskineville", "St Peters", "Marrickville", "Petersham", "Stanmore"],
  "Surry Hills": ["Surry Hills", "Darlinghurst", "Paddington", "Redfern", "Chippendale"],
  "Sydney": ["Sydney", "Surry Hills", "Newtown", "Glebe", "Pyrmont", "Ultimo", "Redfern"],
  "North Sydney": ["North Sydney", "Milsons Point", "Kirribilli", "Cremorne", "Neutral Bay"],
};

function getSuburbsToSearch(suburb: string): string[] {
  if (!suburb) return [];
  // Check exact match first
  if (nearbySuburbs[suburb]) return nearbySuburbs[suburb];
  // Check case-insensitive match
  const key = Object.keys(nearbySuburbs).find(
    k => k.toLowerCase() === suburb.toLowerCase()
  );
  if (key) return nearbySuburbs[key];
  // Fallback — just use the tradie's own suburb
  return [suburb];
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { userId: decoded.id },
  });

  if (!tradieProfile) return NextResponse.json({ error: "Tradie profile not found." }, { status: 404 });

  const suburbsToSearch = getSuburbsToSearch(tradieProfile.suburb || "");
  const tradieState = tradieProfile.state || "NSW";

  const [availableJobs, myQuotes, activeBookings, completedBookings] = await Promise.all([

    // Available job leads — match by suburb radius and state
    prisma.job.findMany({
      where: {
        trade: tradieProfile.specialty,
        status: "OPEN",
        state: { equals: tradieState, mode: "insensitive" },
        ...(suburbsToSearch.length > 0 ? {
          suburb: { in: suburbsToSearch, mode: "insensitive" } as any,
        } : {}),
        NOT: {
          quotes: { some: { tradieProfileId: tradieProfile.id } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: { select: { name: true, suburb: true, state: true } },
        _count: { select: { quotes: true } },
      },
    }),

    // Jobs this tradie has quoted on
    prisma.quote.findMany({
      where: { tradieProfileId: tradieProfile.id },
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          include: {
            user: { select: { name: true, suburb: true, state: true } },
          },
        },
      },
    }),

    // Active bookings
    prisma.booking.findMany({
      where: {
        tradieProfileId: tradieProfile.id,
        status: { in: ["CONFIRMED", "PENDING", "PENDING_CONFIRMATION"] },
      },
      orderBy: { scheduledAt: "asc" },
      include: {
        job: {
          include: {
            user: { select: { name: true, suburb: true, state: true } },
          },
        },
      },
    }),

    // Completed bookings
    prisma.booking.findMany({
      where: {
        tradieProfileId: tradieProfile.id,
        status: "COMPLETED",
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        job: {
          include: {
            user: { select: { name: true, suburb: true, state: true } },
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    availableJobs,
    myQuotes,
    activeBookings,
    completedBookings,
    serviceArea: suburbsToSearch,
  });
}
