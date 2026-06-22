type Props = {
  name: string;
  rating: string;
  specialty: string;
  initials: string;
  avatarBg: string;
};

export function TradieCard({ name, rating, specialty, initials, avatarBg }: Props) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-sm font-bold">{initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm truncate">{name}</h4>
        <p className="text-xs text-gray-400">{specialty}</p>
        <p className="text-xs text-yellow-500 font-medium">⭐ {rating}</p>
      </div>

      {/* Button */}
      <button className="border border-gray-200 hover:border-blue-900 hover:text-blue-900 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
        View Profile
      </button>
    </div>
  );
}
