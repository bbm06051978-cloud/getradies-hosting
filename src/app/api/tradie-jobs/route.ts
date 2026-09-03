import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dlat = (lat2 - lat1) * Math.PI / 180;
  const dlng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dlat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dlng/2)**2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

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
  if (nearbySuburbs[suburb]) return nearbySuburbs[suburb];
  const key = Object.keys(nearbySuburbs).find(
    k => k.toLowerCase() === suburb.toLowerCase()
  );
  if (key) return nearbySuburbs[key];
  return [suburb];
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { userId: decoded.id },
  });

  if (!tradieProfile) return NextResponse.json({ error: "Tradie profile not found." }, { status: 404 });

  const suburbsToSearch = getSuburbsToSearch(tradieProfile.suburb || "");
  const tradieState = tradieProfile.state || "NSW";

  // Get tradie base location coordinates
  const tradieSuburbData = tradieProfile.suburb ? await prisma.suburb.findFirst({
    where: { name: { equals: tradieProfile.suburb, mode: "insensitive" }, state: { equals: tradieProfile.state || "NSW", mode: "insensitive" } },
    select: { lat: true, lng: true },
  }) : null;

  const serviceRadius = tradieProfile.serviceRadius || 30;

  const [availableJobs, myQuotes, activeBookings, completedBookings] = await Promise.all([

    // Available job leads — fetch all in state, filter by distance after
    prisma.job.findMany({
      where: {
        trade: tradieProfile.specialty,
        status: { in: ["OPEN", "QUOTED"] },
        state: { equals: tradieState, mode: "insensitive" },
        NOT: {
          quotes: { some: { tradieProfileId: tradieProfile.id } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, suburb: true, state: true } },
        photos: { select: { url: true } },
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
            user: { select: { id: true, name: true, suburb: true, state: true } },
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
            user: { select: { id: true, name: true, suburb: true, state: true } },
          },
        },
      },
    }),

    // Completed/closed bookings
    prisma.booking.findMany({
      where: {
        tradieProfileId: tradieProfile.id,
        status: { in: ["COMPLETED", "CANCELLED", "DISPUTED"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        job: {
          include: {
            user: { select: { id: true, name: true, suburb: true, state: true } },
          },
        },
        payment: {
          select: {
            amount: true,
            getradieFee: true,
            tradieEarning: true,
            status: true,
            paidAt: true,
          },
        },
      },
    }),
  ]);

  // Filter jobs by distance and add distance field
  let filteredJobs = availableJobs;
  if (tradieSuburbData?.lat && tradieSuburbData?.lng) {
    filteredJobs = availableJobs
      .map(job => {
        // Try to get job suburb coordinates from postcode
        const dist = null; // Will calculate if we have coords
        return { ...job, distanceKm: dist };
      })
      .slice(0, 20);

    // Get coordinates for job suburbs
    const jobSuburbs = [...new Set(availableJobs.map(j => j.suburb))];
    const suburbCoords = await prisma.suburb.findMany({
      where: { name: { in: jobSuburbs, mode: "insensitive" }, state: { equals: tradieState, mode: "insensitive" } },
      select: { name: true, lat: true, lng: true },
    });
    const coordsMap: Record<string, {lat: number, lng: number}> = {};
    suburbCoords.forEach(s => { if (s.lat && s.lng) coordsMap[s.name.toLowerCase()] = { lat: s.lat, lng: s.lng }; });

    filteredJobs = availableJobs
      .map(job => {
        const coords = coordsMap[job.suburb.toLowerCase()];
        const distanceKm = coords && tradieSuburbData.lat && tradieSuburbData.lng
          ? Math.round(haversine(tradieSuburbData.lat, tradieSuburbData.lng, coords.lat, coords.lng) * 10) / 10
          : null;
        return { ...job, distanceKm };
      })
      .filter(job => job.distanceKm === null || job.distanceKm <= serviceRadius)
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
      .slice(0, 20);
  }

  return NextResponse.json({
    availableJobs: filteredJobs,
    myQuotes,
    activeBookings,
    completedBookings,
    serviceArea: suburbsToSearch,
  });
}