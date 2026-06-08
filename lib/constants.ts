export const GENRES = [
  { value: "fantasy", label: "ファンタジー" },
  { value: "sf", label: "未来・SF" },
  { value: "horror", label: "ホラー" },
  { value: "youth", label: "青春" },
  { value: "mystery", label: "ミステリー" },
  { value: "cozy", label: "ほのぼの" },
] as const;

export const PLACE_TYPES = [
  { value: "station", label: "駅" },
  { value: "park", label: "公園・広場" },
  { value: "sea", label: "海辺" },
  { value: "school", label: "学校" },
  { value: "shopping_street", label: "商店街" },
  { value: "mountain", label: "山" },
  { value: "other", label: "その他" },
] as const;

export const MOODS = [
  { value: "gentle", label: "やさしい・癒し" },
  { value: "emotional", label: "エモい・切ない" },
  { value: "mysterious", label: "神秘的・不思議" },
  { value: "exciting", label: "わくわく・冒険" },
  { value: "scary", label: "ちょっと怖い" },
] as const;

export const LEVEL_LABELS: Record<number, string> = {
  1: "噂",
  2: "噂",
  3: "伝説候補",
  4: "伝説候補",
  5: "伝説",
};

export const DEFAULT_CENTER: [number, number] = [35.6595, 139.7005]; // 渋谷あたり
export const DEFAULT_ZOOM = 14;
