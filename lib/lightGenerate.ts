import { resolveImageTheme } from "./imageTheme";
import type { GeneratedSpot } from "./types";

const placeTypeNames: Record<string, string> = {
  station: "駅",
  park: "公園",
  sea: "海辺",
  school: "学校",
  shopping_street: "商店街",
  mountain: "山",
  other: "この場所",
};

const genreWords: Record<string, string[]> = {
  fantasy: ["空行き", "雲上", "星降り", "月明かり"],
  sf: ["未来", "時空", "軌道", "通信"],
  horror: ["影", "消える", "夜だけ", "忘れられた"],
  youth: ["放課後", "約束", "夏空", "帰り道"],
  mystery: ["暗号", "秘密", "失くした", "記憶"],
  cozy: ["雲", "猫", "小さな", "やさしい"],
};

const moodPhrases: Record<string, string> = {
  gentle: "やわらかな光に包まれて、心がほどけていくらしい。",
  emotional: "誰かを想う気持ちが、ふいに胸をしめつけるという。",
  mysterious: "理由はわからないが、確かにそこにあると噂されている。",
  exciting: "一歩踏み込んだ者だけが、まだ見ぬ景色に出会えるそうだ。",
  scary: "深く立ち入った者は、二度と同じ気持ちでは戻れないという。",
};

export function lightGenerate(input: {
  seedText: string;
  genre: string;
  placeType: string;
  mood: string;
}): GeneratedSpot {
  const place = placeTypeNames[input.placeType] ?? "この場所";
  const words = genreWords[input.genre] ?? ["空想"];
  const word = words[Math.floor(Math.random() * words.length)];
  const imageTheme = resolveImageTheme(input.genre, input.placeType);
  const moodLine = moodPhrases[input.mood] ?? "";

  return {
    title: `${word}の${place}`,
    catchCopy: "ここには、まだ誰も知らない空想が眠っている。",
    story: `この${place}には、「${input.seedText}」という噂がある。夕暮れになると、普段は見えない景色が少しだけ姿を見せるらしい。${moodLine}`,
    quest: "この場所で空を見上げ、見えたものを一言コメントしてみよう。",
    tags: [input.genre, input.placeType, input.mood].filter(Boolean),
    imageTheme,
  };
}
