import { LucideIcon, ChevronRight } from "lucide-react";

type Props = {
  title: string;
  category: string;
  posted: string;
  quotes?: number;
  price?: string;
  status?: "booked";
  bookedTime?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

export function JobCard({
  title,
  category,
  posted,
  quotes,
  price,
  status,
  bookedTime,
  icon: Icon,
  iconBg,
  iconColor,
}: Props) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group">
      {/* Icon */}
      <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={iconColor} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-400 mt-0.5">{category} · Posted on {posted}</p>
      </div>

      {/* Right */}
      <div className="text-right flex-shrink-0">
        {status === "booked" ? (
          <>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              Booked
            </span>
            <p className="text-xs text-gray-400 mt-1">{bookedTime}</p>
          </>
        ) : (
          <>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {quotes} Quotes
            </span>
            <p className="text-xs text-gray-500 font-medium mt-1">From {price}</p>
          </>
        )}
      </div>

      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
    </div>
  );
}
