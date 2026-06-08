import { LEVEL_LABELS } from "@/lib/constants";

export default function LevelBadge({ level }: { level: number }) {
  const label = LEVEL_LABELS[level] ?? "噂";
  const isLegend = level >= 5;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        isLegend
          ? "bg-amber-100 text-amber-700"
          : "bg-brand/10 text-brand-dark"
      }`}
    >
      Lv.{level} {label}
    </span>
  );
}
