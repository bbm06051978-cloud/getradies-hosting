// Small date helpers for screens. Everything here uses the viewer's own time zone.

const pad = (n: number) => String(n).padStart(2, "0");

// Values for <input type="date"> and <input type="time">
export function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toTimeInput(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function todayInput(): string {
  return toDateInput(new Date());
}

// Joins the two inputs back into one moment. Returns null until both are filled in.
export function combineLocal(date: string, time: string): Date | null {
  if (!date || !time) return null;
  const d = new Date(`${date}T${time}`);
  return isNaN(d.getTime()) ? null : d;
}

// "Tue 13 Oct, 9:00 am"
export function formatWhen(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-AU", {
    weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true,
  });
}
