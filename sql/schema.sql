-- 空想MAP スキーマ（Supabaseで実行）

create table if not exists fantasy_spots (
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

  author_name text not null default '名無しの旅人',
  user_id uuid,

  is_public boolean not null default true,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists fantasy_comments (
  id uuid primary key default gen_random_uuid(),

  spot_id uuid not null references fantasy_spots(id) on delete cascade,
  comment_text text not null,

  author_name text not null default '名無しの旅人',
  user_id uuid,

  created_at timestamp with time zone default now()
);

create table if not exists fantasy_reactions (
  id uuid primary key default gen_random_uuid(),

  spot_id uuid not null references fantasy_spots(id) on delete cascade,
  reaction_type text not null,

  user_id uuid,

  created_at timestamp with time zone default now()
);

-- RLS（誰でも閲覧・投稿できるMVP方針）
alter table fantasy_spots enable row level security;
alter table fantasy_comments enable row level security;
alter table fantasy_reactions enable row level security;

create policy "Anyone can view public fantasy spots"
on fantasy_spots for select using (is_public = true);

create policy "Anyone can create fantasy spots"
on fantasy_spots for insert with check (true);

create policy "Anyone can update fantasy spots"
on fantasy_spots for update using (true) with check (true);

create policy "Anyone can view comments"
on fantasy_comments for select using (true);

create policy "Anyone can create comments"
on fantasy_comments for insert with check (true);

create policy "Anyone can view reactions"
on fantasy_reactions for select using (true);

create policy "Anyone can create reactions"
on fantasy_reactions for insert with check (true);

-- 初期プリセットデータ
insert into fantasy_spots (
  title, catch_copy, story, latitude, longitude,
  seed_text, genre, place_type, mood, quest, tags,
  image_theme, generation_type, level, author_name, is_public
) values
(
  '雲上行き0番ホーム',
  '終電後、空へ向かう列車が来る。',
  '駅の端には、案内板に載っていない0番ホームがある。そこに停まる列車は、地上ではなく雲の上へ向かうらしい。',
  35.6585, 139.7016,
  'ここに空へ行くホームがあったら', 'fantasy', 'station', 'emotional',
  'この場所で空を見上げ、雲の形をコメントしてみよう。',
  array['駅','空','ファンタジー'],
  'sky_station', 'template', 2, 'ゲスト旅人', true
),
(
  '雲を飼うベンチ',
  '座ると今日の雲が一匹ついてくる。',
  'この公園のベンチに座ると、小さな雲が肩の上に降りてくる。雲はその日の気分によって形を変える。',
  35.6608, 139.6978,
  'この公園に雲を飼うベンチがあったら', 'cozy', 'park', 'gentle',
  '今日の雲に名前をつけてコメントしてみよう。',
  array['公園','雲','ほのぼの'],
  'cloud_park', 'template', 1, 'くもさん', true
),
(
  '空に沈む灯台',
  '夜になると海ではなく空を照らす。',
  '海辺に立つ古い灯台は、満月の夜だけ空に向かって光を放つ。その光は、迷子になった星を家へ返すためのものだという。',
  35.6552, 139.7042,
  'この海に空を照らす灯台があったら', 'fantasy', 'sea', 'mysterious',
  '夜空の中で一番迷っていそうな星を探してみよう。',
  array['海','星','灯台'],
  'star_sea', 'template', 3, '灯台守', true
);
