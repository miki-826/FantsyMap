import { getThemeStyle } from "@/lib/imageTheme";

export default function ThemeBadge({ theme }: { theme: string }) {
  const style = getThemeStyle(theme);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
      <span>{style.icon}</span>
      {style.label}
    </span>
  );
}
