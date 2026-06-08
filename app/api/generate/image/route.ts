import { NextResponse } from "next/server";
import { getThemeStyle } from "@/lib/imageTheme";
import { isOpenAIEnabled } from "@/lib/openai";

type ImageBody = {
  title: string;
  story?: string;
  imageTheme: string;
  genre?: string;
  placeType?: string;
};

function buildPrompt(body: ImageBody): string {
  const theme = getThemeStyle(body.imageTheme);
  return [
    "幻想的で美しい風景イラスト。",
    `テーマ：${theme.label}。`,
    `タイトル：${body.title}。`,
    body.story ? `情景：${body.story}` : "",
    "やわらかな光、空想的、デジタルアート、絵本のような雰囲気。",
    "文字やロゴは入れない。人物の顔のクローズアップは避ける。",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function POST(req: Request) {
  let body: ImageBody;
  try {
    body = (await req.json()) as ImageBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!isOpenAIEnabled) {
    return NextResponse.json({ imageUrl: null, aiUsed: false });
  }

  try {
    const model = process.env.OPENAI_IMAGE_MODEL ?? "dall-e-2";
    const size = process.env.OPENAI_IMAGE_SIZE ?? "512x512";
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        prompt: buildPrompt(body),
        n: 1,
        size,
        response_format: "b64_json",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenAI image error", res.status, text);
      return NextResponse.json({ imageUrl: null, aiUsed: false });
    }

    const data = await res.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return NextResponse.json({ imageUrl: null, aiUsed: false });

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${b64}`,
      aiUsed: true,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ imageUrl: null, aiUsed: false });
  }
}
