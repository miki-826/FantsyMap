export type ThemeStyle = {
  gradient: string;
  icon: string;
  label: string;
};

export const THEME_STYLES: Record<string, ThemeStyle> = {
  sky_station: {
    gradient: "linear-gradient(160deg,#7b8cff 0%,#9d7bff 55%,#c9a6ff 100%)",
    icon: "🚉",
    label: "空の駅",
  },
  cloud_park: {
    gradient: "linear-gradient(160deg,#7ec8ff 0%,#a9e0ff 50%,#dff4ff 100%)",
    icon: "☁️",
    label: "雲の公園",
  },
  star_sea: {
    gradient: "linear-gradient(160deg,#0f2a5a 0%,#1d4e89 55%,#3aa0c9 100%)",
    icon: "🌊",
    label: "星の海",
  },
  shadow_street: {
    gradient: "linear-gradient(160deg,#241b3a 0%,#3d2a63 55%,#6b4ea0 100%)",
    icon: "🏮",
    label: "影の商店街",
  },
  future_school: {
    gradient: "linear-gradient(160deg,#16c1c9 0%,#3a8dde 55%,#7b6bff 100%)",
    icon: "🏫",
    label: "未来の学校",
  },
  moon_mountain: {
    gradient: "linear-gradient(160deg,#1b2347 0%,#3a3f7a 55%,#8a7bc8 100%)",
    icon: "🌙",
    label: "月夜の山",
  },
  mystery_gate: {
    gradient: "linear-gradient(160deg,#3a1d5a 0%,#6b2a89 55%,#b06bff 100%)",
    icon: "🚪",
    label: "不思議な扉",
  },
  default_fantasy: {
    gradient: "linear-gradient(160deg,#6d5dfc 0%,#9d7bff 55%,#c9a6ff 100%)",
    icon: "✨",
    label: "汎用空想",
  },
};

export function getThemeStyle(theme: string): ThemeStyle {
  return THEME_STYLES[theme] ?? THEME_STYLES.default_fantasy;
}

export function resolveImageTheme(genre: string, placeType: string): string {
  if (placeType === "station") return "sky_station";
  if (placeType === "park") return "cloud_park";
  if (placeType === "sea") return "star_sea";
  if (placeType === "shopping_street") return "shadow_street";
  if (placeType === "school") return "future_school";
  if (placeType === "mountain") return "moon_mountain";
  if (genre === "mystery") return "mystery_gate";
  return "default_fantasy";
}
