export function describeAiError(code: string | null | undefined): string {
  switch (code) {
    case "no_api_key":
      return "OPENAI_API_KEYがサーバーに届いていません。Vercelに設定後、再デプロイ（Redeploy）してください。ローカルの場合は .env.local に設定して dev を再起動してください。";
    case "insufficient_quota":
    case "billing_hard_limit_reached":
      return "OpenAIアカウントの残高・課金設定がありません。支払い方法を登録するとAIが使えます。";
    case "invalid_api_key":
    case "invalid_request_error":
      return "APIキーが無効です。鍵の値（sk-...）が正しいか、余計な空白が入っていないか確認してください。";
    case "model_not_found":
      return "指定モデルにアカウントがアクセスできません。OPENAI_MODEL / OPENAI_IMAGE_MODEL を見直してください。";
    case "empty_response":
      return "画像の生成結果が空でした。もう一度お試しください。";
    default:
      return code ? `AI呼び出しに失敗しました：${code}` : "AIの呼び出しに失敗しました。";
  }
}
