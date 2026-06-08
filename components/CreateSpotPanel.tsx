"use client";

import { useState } from "react";
import { GENRES, PLACE_TYPES, MOODS } from "@/lib/constants";
import { lightGenerate } from "@/lib/lightGenerate";
import { getThemeStyle, resolveImageTheme } from "@/lib/imageTheme";
import { createSpot } from "@/lib/store";
import type { FantasySpot, GeneratedSpot } from "@/lib/types";

type LatLng = { lat: number; lng: number };

export default function CreateSpotPanel({
  authorName,
  selectedLatLng,
  onCreated,
}: {
  authorName: string;
  selectedLatLng: LatLng | null;
  onCreated: (spot: FantasySpot) => void;
}) {
  const [seedText, setSeedText] = useState("");
  const [genre, setGenre] = useState<string>(GENRES[0].value);
  const [placeType, setPlaceType] = useState<string>(PLACE_TYPES[0].value);
  const [mood, setMood] = useState<string>(MOODS[0].value);

  const [generated, setGenerated] = useState<GeneratedSpot | null>(null);
  const [usedAi, setUsedAi] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const themeStyle = getThemeStyle(
    generated?.imageTheme ?? resolveImageTheme(genre, placeType),
  );

  function handleLightGenerate() {
    if (!seedText.trim()) return;
    setGenerated(lightGenerate({ seedText: seedText.trim(), genre, placeType, mood }));
    setUsedAi(false);
  }

  async function handleDeepen() {
    if (!seedText.trim() || !selectedLatLng) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate/deepen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: selectedLatLng.lat,
          longitude: selectedLatLng.lng,
          seedText: seedText.trim(),
          genre,
          placeType,
          mood,
        }),
      });
      const data = await res.json();
      setGenerated({
        title: data.title,
        catchCopy: data.catchCopy,
        story: data.story,
        quest: data.quest,
        tags: data.tags ?? [],
        imageTheme: data.imageTheme,
      });
      setUsedAi(Boolean(data.aiUsed));
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSave() {
    if (!generated || !selectedLatLng) return;
    setSaving(true);
    try {
      const spot = await createSpot({
        title: generated.title,
        catch_copy: generated.catchCopy,
        story: generated.story,
        quest: generated.quest,
        tags: generated.tags,
        image_theme: generated.imageTheme,
        latitude: selectedLatLng.lat,
        longitude: selectedLatLng.lng,
        seed_text: seedText.trim(),
        genre,
        place_type: placeType,
        mood,
        generation_type: usedAi ? "ai" : "template",
        author_name: authorName.trim() || "名無しの旅人",
      });
      onCreated(spot);
      setSeedText("");
      setGenerated(null);
      setUsedAi(false);
    } finally {
      setSaving(false);
    }
  }

  const canGenerate = Boolean(seedText.trim());
  const placed = Boolean(selectedLatLng);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto scroll-area p-4">
      <div>
        <h2 className="flex items-center gap-1 text-base font-bold text-slate-800">
          <span>✨</span> 空想スポットをつくる
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {placed
            ? "地図上に場所をマークしました。空想を刻みましょう。"
            : "地図をクリックして、空想を置きたい場所を選んでください。"}
        </p>
      </div>

      <Section step="1" title="空想の種を入力">
        <textarea
          value={seedText}
          onChange={(e) => setSeedText(e.target.value)}
          maxLength={120}
          rows={3}
          placeholder="例：この公園に雲を飼うベンチがあったら"
          className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand"
        />
        <div className="text-right text-[10px] text-slate-400">
          {seedText.length} / 120
        </div>
      </Section>

      <Section step="2" title="カテゴリを選ぶ">
        <Select label="ジャンル" value={genre} onChange={setGenre} options={GENRES} />
        <Select
          label="場所タイプ"
          value={placeType}
          onChange={setPlaceType}
          options={PLACE_TYPES}
        />
        <Select label="雰囲気" value={mood} onChange={setMood} options={MOODS} />
      </Section>

      <Section step="3" title="ライト生成（AIなし）">
        <p className="text-[11px] text-slate-500">
          テンプレートから即座に空想スポットを作ります。API不要・無料です。
        </p>
        <button
          onClick={handleLightGenerate}
          disabled={!canGenerate}
          className="w-full rounded-lg bg-brand py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
        >
          ⚡ ライト生成する
        </button>
      </Section>

      {generated && (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div
            className="mb-2 flex h-20 items-center justify-center rounded-lg text-3xl"
            style={{ background: themeStyle.gradient }}
          >
            {themeStyle.icon}
          </div>
          <p className="text-sm font-bold text-slate-800">{generated.title}</p>
          <p className="mt-0.5 text-xs text-brand-dark">{generated.catchCopy}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {generated.story}
          </p>
          {generated.quest && (
            <p className="mt-2 rounded bg-slate-50 p-2 text-[11px] text-slate-500">
              🎯 {generated.quest}
            </p>
          )}
          <span className="mt-2 inline-block text-[10px] text-slate-400">
            {usedAi ? "AI深掘り済み" : "テンプレート生成"}
          </span>
        </div>
      )}

      <Section step="4" title="AIで深掘り（任意）">
        <p className="text-[11px] text-slate-500">
          気に入ったらAIで物語を高品質化できます（APIキー未設定時は強化テンプレートで動作）。
        </p>
        <button
          onClick={handleDeepen}
          disabled={!canGenerate || !placed || aiLoading}
          className="w-full rounded-lg border border-brand py-2 text-sm font-semibold text-brand transition hover:bg-brand/5 disabled:opacity-40"
        >
          {aiLoading ? "深掘り中..." : "🪄 AIで深掘りする"}
        </button>
      </Section>

      <button
        onClick={handleSave}
        disabled={!generated || !placed || saving}
        className="mt-auto w-full rounded-lg bg-pink-500 py-3 text-sm font-bold text-white shadow transition hover:bg-pink-600 disabled:opacity-40"
      >
        {saving ? "刻んでいます..." : "📍 地図に刻む"}
      </button>
      {!placed && (
        <p className="text-center text-[10px] text-pink-500">
          ※ 先に地図をクリックして場所を選んでください
        </p>
      )}
    </div>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-slate-700">
        <span className="mr-1 text-brand">{step}.</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white p-1.5 text-sm outline-none focus:border-brand"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
