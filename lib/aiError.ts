export function describeAiError(code: string | null | undefined): string {
  if (!code) return "AIの呼び出しに失敗しました。";
  const c = code.toLowerCase();

  if (c.includes("no_api_key")) {
    return "OPENAI_API_KEYがサーバーに届いていません。Vercelに設定後、再デプロイ（Redeploy）してください。ローカルの場合は .env.local に設定して dev を再起動してください。";
  }
  if (c.includes("insufficient_quota") || c.includes("quota") || c.includes("billing")) {
    return "OpenAIアカウントの残高（クレジット）がありません。platform.openai.com の Billing で支払い方法を登録し、クレジットを追加するとAIが使えます。";
  }
  if (c.includes("invalid_api_key") || c.includes("incorrect api key")) {
    return "APIキーが無効です。鍵の値（sk-...）が正しいか、余計な空白が入っていないか確認してください。";
  }
  if (c.includes("must be verified") || c.includes("verify") || c.includes("model_not_found")) {
    return "このモデルはアカウントの本人確認が必要、またはアクセス権がありません。OPENAI_IMAGE_MODEL=dall-e-3 などに切り替えてください。";
  }
  if (c.includes("503") || c.includes("overloaded") || c.includes("rate_limit") || c.includes("429")) {
    return "OpenAI側が一時的に混雑／利用制限中です。少し待ってから再試行してください。";
  }
  if (c.includes("empty_response")) {
    return "画像の生成結果が空でした。もう一度お試しください。";
  }
  return `AI呼び出しに失敗しました：${code}`;
}
