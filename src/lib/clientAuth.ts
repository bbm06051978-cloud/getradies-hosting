// Client-side JWT decoder (no verification - just reads payload)
// Actual verification happens on server/API routes
export function parseJwt(token: string): any {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getRoleFromToken(): string | null {
  const token = getTokenFromCookie();
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.role || null;
}
