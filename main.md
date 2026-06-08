# 要件定義書：空想MAP 改訂版

## 変更点

今回の追加要件はこれ。

> 空想スポット作成後、地図上に簡易的な空想の写真・ビジュアルが表示され、誰でも閲覧できるようにする。

つまり、地図上のピンだけではなく、
**小さな空想フォトカードが地図上に浮かぶ**ような体験にする。

---

# 1. アプリ概要

| 項目    | 内容                                               |
| ----- | ------------------------------------------------ |
| アプリ名  | 空想MAP                                            |
| お題解釈  | 空 = 空想                                           |
| 概要    | 現実の地図上に、AIやテンプレートで作成した空想スポット・物語・写真風カードを重ねるWebアプリ |
| 公開方式  | Vercelで公開                                        |
| データ保存 | Supabase                                         |
| ソース管理 | GitHub                                           |
| 閲覧範囲  | 誰でも閲覧可能                                          |
| 投稿範囲  | MVPでは誰でも投稿可能。余裕があればログイン投稿                        |
| AI方針  | 明示ボタン押下時のみAI使用                                   |
| 画像方針  | MVPではAI画像生成ではなく、プリセット背景＋テキスト合成で簡易写真を作る           |

---

# 2. コンセプト

## 一言コンセプト

> 現実の地図に、空想の写真と物語を重ねるサービス。

## 体験イメージ

ユーザーが地図上の好きな場所をクリックする。

```text
この公園に雲を飼うベンチがあったら
```

と入力すると、空想スポットが作成される。

作成後、地図上には単なるピンではなく、
**小さな空想写真カード**が表示される。

例：

```text
┌──────────────┐
│   幻想的な空背景   │
│ 雲を飼うベンチ     │
│ Lv.2 噂            │
└──────────────┘
```

他の人はそのカードをクリックして、物語やコメントを読むことができる。

---

# 3. システム構成

```text
GitHub
  ↓ push
Vercel
  ↓ deploy
Next.js App
  ↓
Supabase
  ├─ fantasy_spots
  ├─ fantasy_comments
  └─ fantasy_reactions

AI API
  └─ OpenAI / Gemini
```

---

# 4. 技術構成

| 分類      | 技術                      | 用途              |
| ------- | ----------------------- | --------------- |
| フロント    | Next.js                 | Webアプリ本体        |
| UI      | Tailwind CSS            | 画面デザイン          |
| 地図      | React Leaflet           | 地図表示            |
| 地図タイル   | OpenStreetMap           | 無料地図            |
| DB      | Supabase PostgreSQL     | スポット・コメント保存     |
| Storage | Supabase Storage        | 任意。将来的な画像保存用    |
| デプロイ    | Vercel                  | Web公開           |
| ソース管理   | GitHub                  | コード管理           |
| AI      | OpenAI API / Gemini API | 物語深掘り・伝説化       |
| 画像      | プリセット背景 + CSSカード        | API費用を抑えた空想写真表現 |

---

# 5. 重要な方針

## 5.1 誰でも見れる

MVPでは、以下を公開閲覧可能にする。

| データ     | 誰でも閲覧 |
| ------- | ----: |
| 空想スポット  |    可能 |
| 空想写真カード |    可能 |
| 物語      |    可能 |
| コメント    |    可能 |
| レベル     |    可能 |

投稿もMVPでは認証なしで許可してよい。
本番運用ではSupabase Authを追加し、投稿・コメントはログイン必須にする。

---

## 5.2 API使用料を抑える

AIを使う場面は限定する。

| 処理        |    AI使用 | 説明              |
| --------- | ------: | --------------- |
| 地図表示      |      なし | DBから取得          |
| 空想写真カード表示 |      なし | CSSとプリセット背景で表示  |
| ライト生成     |      なし | テンプレート生成        |
| AI深掘り     |      あり | 明示ボタン押下時のみ      |
| ピン再表示     |      なし | 保存済みデータを表示      |
| コメント      |      なし | ユーザー入力          |
| 伝説化       |      あり | コメントが集まった時のみ    |
| 画像生成      | MVPではなし | API費用が高くなりやすいため |

---

# 6. 主要体験フロー

## 6.1 作成フロー

```text
1. ユーザーが地図をクリック
2. 左パネルに作成フォームを表示
3. 空想の種を入力
4. ジャンル・場所タイプ・雰囲気を選択
5. ライト生成を実行
6. タイトル・短い物語・クエスト・画像テーマを生成
7. 必要なら「AIで深掘り」を押す
8. AIが物語を高品質化
9. 「地図に刻む」を押す
10. Supabaseに保存
11. 地図上に空想写真カードとして表示
12. 誰でも閲覧可能になる
```

---

## 6.2 閲覧フロー

```text
1. ユーザーが地図を見る
2. 地図上に複数の空想写真カードが表示される
3. 気になるカードをクリック
4. 右パネルに詳細を表示
5. 物語・クエスト・コメントを閲覧
6. 必要なら噂コメントを追加
```

---

## 6.3 コメント・育成フロー

```text
1. ユーザーが空想スポットを開く
2. 「噂を足す」にコメントを入力
3. コメントがSupabaseに保存される
4. コメント数に応じてLvが上がる
5. コメント3件以上で「AIで伝説化」ボタンが出る
6. AIがコメントを統合して伝説ストーリーを生成
```

---

# 7. 画面要件

## 7.1 PCレイアウト

```text
┌────────────────────────────────────────────┐
│ Header：空想MAP / 現実の街に空想を重ねよう │
├───────────────┬────────────────┬───────────┤
│ 左パネル       │ 地図エリア       │ 右パネル   │
│ 作成フォーム   │ 空想写真カード群 │ 詳細表示   │
└───────────────┴────────────────┴───────────┘
```

---

## 7.2 地図エリア

### 表示内容

地図上には通常のマーカーではなく、
**写真風のミニカード**を表示する。

```text
┌────────────┐
│  空想背景画像 │
│ 星降り改札   │
│ Lv.3 伝説候補 │
└────────────┘
```

### 必須機能

| 機能      | 内容               |
| ------- | ---------------- |
| 地図表示    | OpenStreetMapを表示 |
| 地図クリック  | 緯度経度を取得          |
| 空想カード表示 | DB上のスポットを地図上に表示  |
| カードクリック | 詳細パネルにスポット情報を表示  |
| カードの見た目 | 背景画像、タイトル、Lvを表示  |
| 誰でも閲覧   | 未ログインでも表示可能      |

---

# 8. 空想写真カード仕様

## 8.1 目的

空想写真カードは、AI画像生成の代わりに使う簡易ビジュアル。

API使用料を増やさずに、
「地図に空想が重なっている感覚」を出す。

---

## 8.2 表示項目

| 項目       | 内容                              |
| -------- | ------------------------------- |
| 背景       | ジャンル・場所タイプに応じたプリセット画像またはグラデーション |
| タイトル     | 空想スポット名                         |
| レベル      | Lv.1〜Lv.5                       |
| ジャンルアイコン | 任意                              |
| 生成種別     | template / AI                   |

---

## 8.3 サイズ

| 状態   | サイズ               |
| ---- | ----------------- |
| 通常表示 | 幅120px × 高さ90px   |
| ホバー時 | 少し拡大              |
| 選択時  | 枠線や影で強調           |
| スマホ  | 幅100px × 高さ80px程度 |

---

## 8.4 画像テーマ

画像そのものを毎回AI生成しない。
代わりに、以下の `image_theme` をDBに保存する。

| image_theme     | 用途    |
| --------------- | ----- |
| sky_station     | 空の駅   |
| cloud_park      | 雲の公園  |
| star_sea        | 星の海   |
| shadow_street   | 影の商店街 |
| future_school   | 未来の学校 |
| moon_mountain   | 月夜の山  |
| mystery_gate    | 不思議な扉 |
| default_fantasy | 汎用空想  |

---

## 8.5 表示方式

### 方式A：CSSグラデーション

一番簡単。

```text
sky_station:
青紫グラデーション + 駅アイコン

cloud_park:
水色グラデーション + 雲アイコン

shadow_street:
黒紫グラデーション + 街灯アイコン
```

メリット：

```text
- 画像ファイル不要
- API不要
- 表示が速い
- 3時間で作れる
```

---

### 方式B：プリセット画像

`public/fantasy-themes/` に画像を置く。

```text
public/
└─ fantasy-themes/
   ├─ sky-station.jpg
   ├─ cloud-park.jpg
   ├─ star-sea.jpg
   ├─ shadow-street.jpg
   ├─ future-school.jpg
   └─ default.jpg
```

メリット：

```text
- 見た目が強い
- 地図上の映えが良い
- API費用なし
```

ハッカソンでは、
**最初はCSSグラデーションで実装し、余裕があればプリセット画像に差し替え**が安全。

---

# 9. 生成仕様

## 9.1 ライト生成で作るもの

ライト生成はAPIなし。

```ts
type GeneratedSpot = {
  title: string;
  catchCopy: string;
  story: string;
  quest: string;
  tags: string[];
  imageTheme: string;
};
```

---

## 9.2 imageTheme決定ロジック

ジャンルと場所タイプから自動決定する。

```ts
function resolveImageTheme(genre: string, placeType: string): string {
  if (placeType === "station") return "sky_station";
  if (placeType === "park") return "cloud_park";
  if (placeType === "sea") return "star_sea";
  if (placeType === "shopping_street") return "shadow_street";
  if (placeType === "school") return "future_school";
  if (placeType === "mountain") return "moon_mountain";
  if (genre === "mystery") return "mystery_gate";
  return "default_fantasy";
}
```

---

## 9.3 AI深掘りで作るもの

AI深掘りでは、画像そのものは生成しない。
代わりに、物語と一緒に `imageTheme` を返してもよい。

```json
{
  "title": "雲上行き0番ホーム",
  "catchCopy": "終電後、迷った人だけが辿り着く空のホーム。",
  "story": "大分駅の端に、案内板には載っていない0番ホームがある。",
  "quest": "この場所で空を見上げ、雲の形をコメントしてみよう。",
  "tags": ["駅", "空", "ファンタジー"],
  "imageTheme": "sky_station"
}
```

---

# 10. データベース設計

## 10.1 fantasy_spots

```sql
create table fantasy_spots (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  catch_copy text,
  story text not null,

  legend_title text,
  legend_story text,
  legend_tagline text,

  latitude double precision not null,
  longitude double precision not null,
  location_name text,

  seed_text text not null,
  genre text not null,
  place_type text not null,
  mood text,

  quest text,
  tags text[] default '{}',

  image_theme text not null default 'default_fantasy',
  image_url text,

  generation_type text not null default 'template',

  level int not null default 1,

  comment_count int not null default 0,
  believe_count int not null default 0,
  visited_count int not null default 0,
  want_to_go_count int not null default 0,

  user_id uuid,

  is_public boolean not null default true,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

## 10.2 fantasy_comments

```sql
create table fantasy_comments (
  id uuid primary key default gen_random_uuid(),

  spot_id uuid not null references fantasy_spots(id) on delete cascade,
  comment_text text not null,

  user_id uuid,

  created_at timestamp with time zone default now()
);
```

---

## 10.3 fantasy_reactions

```sql
create table fantasy_reactions (
  id uuid primary key default gen_random_uuid(),

  spot_id uuid not null references fantasy_spots(id) on delete cascade,
  reaction_type text not null,

  user_id uuid,

  created_at timestamp with time zone default now()
);
```

---

# 11. 公開閲覧ポリシー

## 11.1 MVP

MVPでは以下の設計。

| 操作       |     ログインなし |
| -------- | ---------: |
| 地図を見る    |         可能 |
| 空想カードを見る |         可能 |
| 物語を見る    |         可能 |
| コメントを見る  |         可能 |
| 空想スポット投稿 |         可能 |
| コメント投稿   |         可能 |
| AI深掘り    | 可能。ただし制限推奨 |

---

## 11.2 Supabase RLS方針

ハッカソンMVPでは速度優先で、RLSを一時的にOFFでもよい。

本番公開に近づけるなら、RLS ONで以下。

```sql
alter table fantasy_spots enable row level security;
alter table fantasy_comments enable row level security;
alter table fantasy_reactions enable row level security;
```

### 誰でも閲覧可能

```sql
create policy "Anyone can view public fantasy spots"
on fantasy_spots
for select
using (is_public = true);

create policy "Anyone can view comments"
on fantasy_comments
for select
using (true);

create policy "Anyone can view reactions"
on fantasy_reactions
for select
using (true);
```

### MVPでは誰でも投稿可能

```sql
create policy "Anyone can create fantasy spots"
on fantasy_spots
for insert
with check (true);

create policy "Anyone can create comments"
on fantasy_comments
for insert
with check (true);

create policy "Anyone can create reactions"
on fantasy_reactions
for insert
with check (true);
```

---

# 12. コンポーネント設計

## 12.1 ディレクトリ構成

```text
fantasy-map/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ api/
│     └─ generate/
│        ├─ deepen/
│        │  └─ route.ts
│        └─ legend/
│           └─ route.ts
│
├─ components/
│  ├─ MapView.tsx
│  ├─ FantasyPhotoMarker.tsx
│  ├─ CreateSpotPanel.tsx
│  ├─ SpotDetailPanel.tsx
│  ├─ SpotPhotoCard.tsx
│  ├─ CommentList.tsx
│  ├─ LevelBadge.tsx
│  └─ ThemeBadge.tsx
│
├─ lib/
│  ├─ supabaseClient.ts
│  ├─ lightGenerate.ts
│  ├─ imageTheme.ts
│  ├─ aiPrompts.ts
│  ├─ types.ts
│  └─ constants.ts
│
├─ hooks/
│  ├─ useSpots.ts
│  └─ useComments.ts
│
├─ sql/
│  └─ schema.sql
│
├─ public/
│  └─ fantasy-themes/
│     ├─ sky-station.jpg
│     ├─ cloud-park.jpg
│     ├─ star-sea.jpg
│     ├─ shadow-street.jpg
│     ├─ future-school.jpg
│     └─ default.jpg
│
├─ .env.local.example
├─ package.json
└─ README.md
```

---

## 12.2 主要コンポーネント

| コンポーネント                  | 役割                    |
| ------------------------ | --------------------- |
| `MapView.tsx`            | 地図表示、クリック取得、カードマーカー表示 |
| `FantasyPhotoMarker.tsx` | 地図上の空想写真カード           |
| `CreateSpotPanel.tsx`    | 空想スポット作成フォーム          |
| `SpotDetailPanel.tsx`    | 選択中スポットの詳細            |
| `SpotPhotoCard.tsx`      | 詳細パネル内の大きめ写真カード       |
| `CommentList.tsx`        | コメント表示                |
| `LevelBadge.tsx`         | Lv表示                  |
| `ThemeBadge.tsx`         | ジャンル・テーマ表示            |

---

# 13. 地図上の空想写真カード仕様

## 13.1 `FantasyPhotoMarker`

React Leafletの `DivIcon` を使って、HTMLカードをマーカーとして表示する。

### 表示例

```text
┌──────────────┐
│  背景画像     │
│              │
│ 雲上行き0番ホーム │
│ Lv.2 噂       │
└──────────────┘
```

---

## 13.2 表示項目

```ts
type FantasyPhotoMarkerProps = {
  spot: FantasySpot;
  isSelected: boolean;
  onClick: () => void;
};
```

---

## 13.3 デザイン仕様

| 項目   | 内容                           |
| ---- | ---------------------------- |
| 幅    | 120px                        |
| 高さ   | 92px                         |
| 角丸   | 12px                         |
| 影    | あり                           |
| 背景   | image_themeに応じた画像 or グラデーション |
| タイトル | 最大2行                         |
| Lv   | 左上または下部に表示                   |
| ホバー  | scale 1.05                   |
| 選択中  | 枠線を強調                        |

---

# 14. 型定義

## 14.1 `FantasySpot`

```ts
export type FantasySpot = {
  id: string;

  title: string;
  catch_copy: string | null;
  story: string;

  legend_title: string | null;
  legend_story: string | null;
  legend_tagline: string | null;

  latitude: number;
  longitude: number;
  location_name: string | null;

  seed_text: string;
  genre: string;
  place_type: string;
  mood: string | null;

  quest: string | null;
  tags: string[];

  image_theme: string;
  image_url: string | null;

  generation_type: "template" | "ai";

  level: number;

  comment_count: number;
  believe_count: number;
  visited_count: number;
  want_to_go_count: number;

  user_id: string | null;
  is_public: boolean;

  created_at: string;
  updated_at: string;
};
```

---

## 14.2 `GeneratedSpot`

```ts
export type GeneratedSpot = {
  title: string;
  catchCopy: string;
  story: string;
  quest: string;
  tags: string[];
  imageTheme: string;
};
```

---

# 15. API設計

## 15.1 `/api/generate/deepen`

### 目的

空想スポットの物語をAIで深掘りする。
画像そのものは生成しない。

### Request

```json
{
  "locationName": "大分駅前",
  "latitude": 33.232,
  "longitude": 131.606,
  "seedText": "ここに空へ行くホームがあったら",
  "genre": "fantasy",
  "placeType": "station",
  "mood": "emotional"
}
```

### Response

```json
{
  "title": "雲上行き0番ホーム",
  "catchCopy": "終電後、迷った人だけが辿り着く空のホーム。",
  "story": "大分駅の端に、案内板には載っていない0番ホームがある。",
  "quest": "この場所で空を見上げ、雲の形をコメントしてみよう。",
  "tags": ["駅", "空", "ファンタジー"],
  "imageTheme": "sky_station"
}
```

---

## 15.2 `/api/generate/legend`

### 目的

コメントを統合して、空想スポットを伝説化する。

### Request

```json
{
  "spotId": "uuid",
  "title": "雲上行き0番ホーム",
  "story": "大分駅の端に、案内板には載っていない0番ホームがある。",
  "comments": [
    "雨の日だけホームが見えるらしい",
    "切符は白い羽で買える",
    "乗った人は一通だけ手紙を出せる"
  ]
}
```

### Response

```json
{
  "legendTitle": "雨夜に現れる雲上ホーム",
  "legendTagline": "白い羽の切符を持つ者だけが、空へ向かう列車に乗れる。",
  "legendStory": "大分駅には、雨の終電後だけ現れる0番ホームの噂がある。"
}
```

---

# 16. AIプロンプト

## 16.1 深掘り生成

```text
あなたは「現実の地図に空想を重ねる」短編ストーリーテラーです。

以下の入力から、実在の場所にありそうで存在しない空想スポットを作成してください。

条件：
- 物語は180字以内
- 地図ピンで読みやすい短さにする
- 実在の個人、店舗、施設に迷惑がかかる表現は避ける
- 犯罪、危険行為、差別表現、過度に怖い表現は避ける
- imageThemeは以下から1つだけ選ぶ
  - sky_station
  - cloud_park
  - star_sea
  - shadow_street
  - future_school
  - moon_mountain
  - mystery_gate
  - default_fantasy
- 出力はJSONのみ
- JSON以外の文章は出力しない

入力：
場所名：{{locationName}}
緯度：{{latitude}}
経度：{{longitude}}
場所タイプ：{{placeType}}
ジャンル：{{genre}}
雰囲気：{{mood}}
空想の種：{{seedText}}

出力形式：
{
  "title": "",
  "catchCopy": "",
  "story": "",
  "quest": "",
  "tags": [],
  "imageTheme": ""
}
```

---

# 17. ライト生成仕様

## 17.1 目的

AI APIを使わず、即時に空想スポットを作成する。

---

## 17.2 生成ロジック

```ts
const placeTypeNames = {
  station: "駅",
  park: "公園",
  sea: "海辺",
  school: "学校",
  shopping_street: "商店街",
  mountain: "山",
  other: "この場所",
};

const genreWords = {
  fantasy: ["空行き", "雲上", "星降り", "月明かり"],
  sf: ["未来", "時空", "軌道", "通信"],
  horror: ["影", "消える", "夜だけ", "忘れられた"],
  youth: ["放課後", "約束", "夏空", "帰り道"],
  mystery: ["暗号", "秘密", "失くした", "記憶"],
  cozy: ["雲", "猫", "小さな", "やさしい"],
};

export function resolveImageTheme(genre: string, placeType: string): string {
  if (placeType === "station") return "sky_station";
  if (placeType === "park") return "cloud_park";
  if (placeType === "sea") return "star_sea";
  if (placeType === "shopping_street") return "shadow_street";
  if (placeType === "school") return "future_school";
  if (placeType === "mountain") return "moon_mountain";
  if (genre === "mystery") return "mystery_gate";
  return "default_fantasy";
}
```

---

## 17.3 ライト生成例

```ts
export function lightGenerate(input: {
  seedText: string;
  genre: string;
  placeType: string;
  mood: string;
}) {
  const place = placeTypeNames[input.placeType] ?? "この場所";
  const words = genreWords[input.genre] ?? ["空想"];
  const word = words[Math.floor(Math.random() * words.length)];
  const imageTheme = resolveImageTheme(input.genre, input.placeType);

  return {
    title: `${word}の${place}`,
    catchCopy: "ここには、まだ誰も知らない空想が眠っている。",
    story: `この${place}には、「${input.seedText}」という噂がある。夕暮れになると、普段は見えない景色が少しだけ姿を見せるらしい。`,
    quest: "この場所で空を見上げ、見えたものを一言コメントしてみよう。",
    tags: [input.genre, input.placeType, input.mood].filter(Boolean),
    imageTheme,
  };
}
```

---

# 18. Supabase保存仕様

## 18.1 空想スポット保存時

保存するデータ。

```ts
const insertData = {
  title: generated.title,
  catch_copy: generated.catchCopy,
  story: generated.story,
  quest: generated.quest,
  tags: generated.tags,
  image_theme: generated.imageTheme,

  latitude: selectedLatLng.lat,
  longitude: selectedLatLng.lng,

  seed_text: form.seedText,
  genre: form.genre,
  place_type: form.placeType,
  mood: form.mood,

  generation_type: usedAi ? "ai" : "template",
  is_public: true,
};
```

---

## 18.2 地図表示時

```ts
const { data } = await supabase
  .from("fantasy_spots")
  .select("*")
  .eq("is_public", true)
  .order("created_at", { ascending: false });
```

取得した `fantasy_spots` を地図上の空想写真カードとして表示する。

---

# 19. 初期プリセットデータ

デモ映えのため、最初から5件入れておく。

```sql
insert into fantasy_spots (
  title,
  catch_copy,
  story,
  latitude,
  longitude,
  seed_text,
  genre,
  place_type,
  mood,
  quest,
  tags,
  image_theme,
  generation_type,
  level,
  is_public
) values
(
  '雲上行き0番ホーム',
  '終電後、空へ向かう列車が来る。',
  '駅の端には、案内板に載っていない0番ホームがある。そこに停まる列車は、地上ではなく雲の上へ向かうらしい。',
  33.232,
  131.606,
  'ここに空へ行くホームがあったら',
  'fantasy',
  'station',
  'emotional',
  'この場所で空を見上げ、雲の形をコメントしてみよう。',
  array['駅','空','ファンタジー'],
  'sky_station',
  'template',
  2,
  true
),
(
  '雲を飼うベンチ',
  '座ると今日の雲が一匹ついてくる。',
  'この公園のベンチに座ると、小さな雲が肩の上に降りてくる。雲はその日の気分によって形を変える。',
  33.235,
  131.61,
  'この公園に雲を飼うベンチがあったら',
  'cozy',
  'park',
  'gentle',
  '今日の雲に名前をつけてコメントしてみよう。',
  array['公園','雲','ほのぼの'],
  'cloud_park',
  'template',
  1,
  true
),
(
  '空に沈む灯台',
  '夜になると海ではなく空を照らす。',
  '海辺に立つ古い灯台は、満月の夜だけ空に向かって光を放つ。その光は、迷子になった星を家へ返すためのものだという。',
  33.245,
  131.62,
  'この海に空を照らす灯台があったら',
  'fantasy',
  'sea',
  'mysterious',
  '夜空の中で一番迷っていそうな星を探してみよう。',
  array['海','星','灯台'],
  'star_sea',
  'template',
  3,
  true
);
```

---

# 20. 実装優先度

## 最優先

| 優先度 | 機能               |
| --- | ---------------- |
| 高   | 地図表示             |
| 高   | Supabaseからスポット取得 |
| 高   | 空想写真カードを地図上に表示   |
| 高   | 地図クリックで作成フォーム表示  |
| 高   | ライト生成            |
| 高   | Supabase保存       |
| 高   | 誰でも閲覧可能          |

---

## 次に実装

| 優先度 | 機能     |
| --- | ------ |
| 中   | AI深掘り  |
| 中   | コメント投稿 |
| 中   | Lv表示   |
| 中   | 伝説化    |

---

## 後回し

| 優先度 | 機能       |
| --- | -------- |
| 低   | ログイン     |
| 低   | AI画像生成   |
| 低   | 写真アップロード |
| 低   | ランキング    |
| 低   | SNS共有    |

---

# 21. MVP完成条件

この状態なら、ハッカソンで十分見せられる。

```text
1. Vercelで公開されている
2. 誰でも地図を開ける
3. 地図上に空想写真カードが表示される
4. カードをクリックすると物語が読める
5. 地図クリックで新しい空想スポットを作れる
6. ライト生成でAPIなし作成ができる
7. AIで深掘りボタンからAI生成できる
8. 作成したスポットがSupabaseに保存される
9. リロードしてもカードが残る
10. 他の人も同じカードを閲覧できる
```

---

# 22. ハッカソン向け開発順序

## 0:00〜0:20

```text
Next.js作成
GitHub push
Vercel連携
Supabase作成
schema.sql実行
```

## 0:20〜0:55

```text
React Leaflet導入
地図表示
地図クリック取得
```

## 0:55〜1:25

```text
Supabase接続
fantasy_spots取得
初期プリセット表示
```

## 1:25〜1:55

```text
FantasyPhotoMarker実装
地図上に写真カード表示
カードクリックで詳細表示
```

## 1:55〜2:20

```text
作成フォーム
ライト生成
Supabase保存
```

## 2:20〜2:40

```text
AI深掘りAPI
生成結果の反映
```

## 2:40〜3:00

```text
UI調整
コメント機能またはLv表示
デモ確認
```

---

# 23. 発表用説明文

```text
私たちは「空」というお題を、“空想”として解釈しました。

空想MAPは、現実の地図上に、存在しない場所や物語を重ねるWebアプリです。

ユーザーが地図上の好きな場所を選び、
「ここに空へ行くホームがあったら」のような空想の種を入力すると、
空想スポットが作成されます。

作成されたスポットは、地図上に写真風カードとして表示され、
誰でもその場所の物語を見ることができます。

AIは毎回使うのではなく、
まずテンプレートで軽量に空想スポットを作成し、
気に入ったものだけAIで深掘りします。

これにより、AIらしい体験とAPIコスト削減を両立しました。
```

---

# 24. 最終仕様まとめ

## 作るもの

> 地図上に、空想の写真カードと物語を重ねるWebアプリ。

## 一番重要な体験

```text
地図を見る
↓
空想写真カードが浮かんでいる
↓
気になるカードを開く
↓
その場所の空想物語が読める
↓
自分も地図に空想を置ける
```

## 技術構成

```text
Next.js
React Leaflet
OpenStreetMap
Supabase
Vercel
GitHub
OpenAI API または Gemini API
```

## コスト削減設計

```text
AI画像生成は使わない
空想写真はプリセット背景かCSSで表現
AIテキスト生成はボタン押下時のみ
生成結果はSupabaseに保存
再表示ではAPIを呼ばない
```

この改訂版なら、**見た目のインパクト**と**API使用料の低さ**を両立できる。
ハッカソンでは「地図上に写真カードが浮かぶ」だけで、かなり体験として伝わりやすくなる。
