import { NextResponse } from "next/server";
import { getThemeStyle } from "@/lib/imageTheme";
import { isOpenAIEnabled, summarizeOpenAIError } from "@/lib/openai";

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
    return NextResponse.json({ imageUrl: null, aiUsed: false, error: "no_api_key" });
  }

  try {
    const model = process.env.OPENAI_IMAGE_MODEL ?? "dall-e-2";
    const isGptImage = model.startsWith("gpt-image");
    let size = process.env.OPENAI_IMAGE_SIZE ?? (isGptImage ? "1536x1024" : "512x512");
    // gpt-image系は 256/512 サイズを受け付けない
    if (isGptImage && /^(256|512)x/.test(size)) size = "1024x1024";

    const payload: Record<string, unknown> = {
      model,
      prompt: buildPrompt(body),
      n: 1,
      size,
    };
    // response_format は dall-e系のみ対応（gpt-image系は標準でb64_jsonを返す）
    if (!isGptImage) payload.response_format = "b64_json";
    // quality は gpt-image系のみ（low/medium/high/auto）
    if (isGptImage && process.env.OPENAI_IMAGE_QUALITY) {
      payload.quality = process.env.OPENAI_IMAGE_QUALITY;
    }

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenAI image error", res.status, text);
      return NextResponse.json({
        imageUrl: null,
        aiUsed: false,
        error: summarizeOpenAIError(res.status, text),
      });
    }

    const data = await res.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64)
      return NextResponse.json({ imageUrl: null, aiUsed: false, error: "empty_response" });

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${b64}`,
      aiUsed: true,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      imageUrl: null,
      aiUsed: false,
      error: e instanceof Error ? e.message : "unknown_error",
    });
  }
}
