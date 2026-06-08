import { getThemeStyle } from "@/lib/imageTheme";
import LevelBadge from "./LevelBadge";

export default function SpotPhotoCard({
  imageTheme,
  imageUrl,
  title,
  level,
}: {
  imageTheme: string;
  imageUrl?: string | null;
  title: string;
  level: number;
}) {
  const style = getThemeStyle(imageTheme);
  return (
    <div className="relative overflow-hidden rounded-xl shadow">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title} className="h-36 w-full object-cover" />
      ) : (
        <div
          className="flex h-36 items-center justify-center text-5xl"
          style={{ background: style.gradient }}
        >
          <span className="drop-shadow">{style.icon}</span>
        </div>
      )}
      <div className="absolute right-2 top-2">
        <LevelBadge level={level} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
        <p className="text-sm font-bold text-white drop-shadow">{title}</p>
      </div>
    </div>
  );
}
