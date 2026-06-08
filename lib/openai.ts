export const isOpenAIEnabled = Boolean(process.env.OPENAI_API_KEY);

export function summarizeOpenAIError(status: number, text: string): string {
  try {
    const j = JSON.parse(text);
    return (
      j?.error?.code ||
      j?.error?.type ||
      j?.error?.message ||
      `HTTP ${status}`
    );
  } catch {
    return `HTTP ${status}`;
  }
}

export async function chatJSON(
  system: string,
  user: string,
): Promise<Record<string, unknown>> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(summarizeOpenAIError(res.status, text));
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content);
}
