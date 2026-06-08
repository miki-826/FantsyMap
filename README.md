# 空想MAP 🗺️✨

現実の地図上に、空想スポット・物語・写真風カードを重ねるWebアプリです。
「空」というお題を **"空想"** として解釈しました。

地図の好きな場所をクリックして「ここに空へ行くホームがあったら」のような
**空想の種** を入力すると、地図上に小さな **空想フォトカード** が浮かびます。
誰でも好きな名前で投稿でき、ログインは不要です。

## 主な機能

- 🗺️ OpenStreetMap上に空想フォトカードを表示（React Leaflet の DivIcon）
- 📍 地図クリックで場所を選び、空想スポットを作成
- ⚡ ライト生成（APIなし・無料のテンプレート生成）
- 🪄 AIで深掘り（OpenAI。未設定時は強化テンプレートで動作）
- 💬 噂コメント投稿でレベルアップ
- 👑 コメント3件以上でAI伝説化
- 🙂 ログイン不要。好きな名前で投稿可能

## 技術構成

| 分類 | 技術 |
| --- | --- |
| フロント | Next.js 14 (App Router) |
| UI | Tailwind CSS |
| 地図 | React Leaflet + OpenStreetMap |
| DB | Supabase（任意。未設定時はブラウザのローカル保存） |
| AI | OpenAI API（任意） |
| デプロイ | Vercel |

## セットアップ

```bash
npm install
cp .env.local.example .env.local   # 必要に応じて値を設定
npm run dev
```

`http://localhost:3000` を開きます。
**環境変数を何も設定しなくても**、ブラウザのローカル保存モードでそのまま動作します。

### Supabaseを使う場合

1. Supabaseプロジェクトを作成
2. `sql/schema.sql` をSQL Editorで実行
3. `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定

### AI機能を使う場合

`.env.local` に `OPENAI_API_KEY` を設定すると、AI深掘り・伝説化が実際のLLM生成になります。
未設定でもボタンは動作し、強化テンプレートで結果を返します。

## Vercelへのデプロイ

GitHubリポジトリをVercelに連携し、必要なら上記の環境変数を設定してデプロイします。

## ディレクトリ構成

```
app/            画面・APIルート
components/     地図・パネル・カードなどのUI
lib/            生成ロジック・テーマ・データストア・型
sql/            Supabaseスキーマ
```

## データ保存について

- 環境変数に Supabase を設定 → Supabaseに保存（誰でも共有閲覧）
- 未設定 → 各ブラウザの localStorage に保存（その端末内で永続化）

ハッカソンMVPとして、まずローカル保存で体験を確認し、
Supabaseを繋ぐだけで共有公開できる構成にしています。
