import { NextResponse } from "next/server";
import { buildDeepenUserPrompt, DEEPEN_SYSTEM } from "@/lib/aiPrompts";
import { chatJSON, isOpenAIEnabled } from "@/lib/openai";
import { resolveImageTheme } from "@/lib/imageTheme";

type DeepenBody = {
  locationName?: string;
  latitude: number;
  longitude: number;
  seedText: string;
  genre: string;
  placeType: string;
  mood?: string;
};

function fallback(body: DeepenBody) {
  const theme = resolveImageTheme(body.genre, body.placeType);
  return {
    title: `${body.seedText.slice(0, 12)}の場所`,
    catchCopy: "語り継がれるうちに、輪郭がはっきりしてきた空想。",
    story: `${body.seedText}。最初はただの噂だったが、訪れた人が少しずつその情景を語り継ぐうちに、ここには確かに“それ”があると囁かれるようになった。月のない夜ほど、その気配は濃くなるという。`,
    quest: "あなたが感じた気配を、ひとことで書き残してみよう。",
    tags: [body.genre, body.placeType].filter(Boolean),
    imageTheme: theme,
    aiUsed: false,
  };
}

export async function POST(req: Request) {
  let body: DeepenBody;
  try {
    body = (await req.json()) as DeepenBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!isOpenAIEnabled) {
    return NextResponse.json(fallback(body));
  }

  try {
    const json = await chatJSON(DEEPEN_SYSTEM, buildDeepenUserPrompt(body));
    return NextResponse.json({
      title: String(json.title ?? ""),
      catchCopy: String(json.catchCopy ?? ""),
      story: String(json.story ?? ""),
      quest: String(json.quest ?? ""),
      tags: Array.isArray(json.tags) ? json.tags.map(String) : [],
      imageTheme: String(json.imageTheme ?? resolveImageTheme(body.genre, body.placeType)),
      aiUsed: true,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(fallback(body));
  }
}
