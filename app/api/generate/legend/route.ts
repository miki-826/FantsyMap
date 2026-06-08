import { NextResponse } from "next/server";
import { LEGEND_SYSTEM } from "@/lib/aiPrompts";
import { chatJSON, isOpenAIEnabled } from "@/lib/openai";

type LegendBody = {
  spotId: string;
  title: string;
  story: string;
  comments: string[];
};

function fallback(body: LegendBody) {
  const first = body.comments[0] ?? "";
  return {
    legendTitle: `語り継がれし${body.title}`,
    legendTagline: "幾人もの噂が重なり、ひとつの伝説になった。",
    legendStory: `${body.story} やがて訪れた人々が口々に語った——${first ? `「${first}」` : ""}。それらの声が編み合わさり、この場所はただの噂ではなく、確かな伝説として土地に刻まれた。`,
    aiUsed: false,
  };
}

export async function POST(req: Request) {
  let body: LegendBody;
  try {
    body = (await req.json()) as LegendBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!isOpenAIEnabled) {
    return NextResponse.json(fallback(body));
  }

  try {
    const user = `タイトル：${body.title}
物語：${body.story}
集まったコメント：
${body.comments.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;
    const json = await chatJSON(LEGEND_SYSTEM, user);
    return NextResponse.json({
      legendTitle: String(json.legendTitle ?? ""),
      legendTagline: String(json.legendTagline ?? ""),
      legendStory: String(json.legendStory ?? ""),
      aiUsed: true,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(fallback(body));
  }
}
