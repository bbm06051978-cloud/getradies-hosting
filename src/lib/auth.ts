import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: {
  id: string;
  email: string;
  role: string;
  name: string;
}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function getTokenFromRequest(req: Request): string | null {
  // Try cookie first
  const cookieToken = (req as any).cookies?.get?.("token")?.value;
  if (cookieToken) return cookieToken;
  // Try Authorization header (for mobile)
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return null;
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };
  } catch {
    return null;
  }
}
