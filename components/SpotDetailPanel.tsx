"use client";

import { useEffect, useState } from "react";
import { GENRES, PLACE_TYPES, MOODS } from "@/lib/constants";
import {
  addComment,
  addReaction,
  applyLegend,
  fetchComments,
  updateSpotImage,
} from "@/lib/store";
import type { FantasyComment, FantasySpot, ReactionType } from "@/lib/types";
import SpotPhotoCard from "./SpotPhotoCard";
import ThemeBadge from "./ThemeBadge";
import CommentList from "./CommentList";

function labelOf(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export default function SpotDetailPanel({
  spot,
  authorName,
  onClose,
  onSpotUpdate,
}: {
  spot: FantasySpot;
  authorName: string;
  onClose: () => void;
  onSpotUpdate: (spot: FantasySpot) => void;
}) {
  const [comments, setComments] = useState<FantasyComment[]>([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [legendLoading, setLegendLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetchComments(spot.id).then((c) => {
      if (active) setComments(c);
    });
    return () => {
      active = false;
    };
  }, [spot.id]);

  async function handlePost() {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const { comment, level, commentCount } = await addComment(
        spot.id,
        text.trim(),
        authorName.trim() || "名無しの旅人",
      );
      setComments((prev) => [...prev, comment]);
      setText("");
      onSpotUpdate({ ...spot, level, comment_count: commentCount });
    } finally {
      setPosting(false);
    }
  }

  async function handleReaction(type: ReactionType) {
    const updated = await addReaction(spot.id, type);
    if (updated) onSpotUpdate(updated);
  }

  async function handleGenerateImage() {
    setImageLoading(true);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: spot.title,
          story: spot.story,
          imageTheme: spot.image_theme,
          genre: spot.genre,
          placeType: spot.place_type,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        const updated = await updateSpotImage(spot.id, data.imageUrl);
        if (updated) onSpotUpdate(updated);
      } else {
        alert(
          "画像生成にはOpenAIのAPIキー（OPENAI_API_KEY）が必要です。未設定のためグラデーション表示になります。",
        );
      }
    } finally {
      setImageLoading(false);
    }
  }

  async function handleLegend() {
    setLegendLoading(true);
    try {
      const res = await fetch("/api/generate/legend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotId: spot.id,
          title: spot.title,
          story: spot.story,
          comments: comments.map((c) => c.comment_text),
        }),
      });
      const data = await res.json();
      const updated = await applyLegend(spot.id, {
        legendTitle: data.legendTitle,
        legendTagline: data.legendTagline,
        legendStory: data.legendStory,
      });
      if (updated) onSpotUpdate(updated);
    } finally {
      setLegendLoading(false);
    }
  }

  const canLegend = comments.length >= 3 && !spot.legend_title;

  return (
    <div className="flex h-full flex-col overflow-y-auto scroll-area">
      <div className="relative">
        <SpotPhotoCard
          imageTheme={spot.image_theme}
          imageUrl={spot.image_url}
          title={spot.title}
          level={spot.level}
        />
        <button
          onClick={handleGenerateImage}
          disabled={imageLoading}
          className="absolute bottom-2 right-2 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-brand shadow transition hover:bg-white disabled:opacity-50"
        >
          {imageLoading ? "生成中..." : spot.image_url ? "🎨 作り直す" : "🎨 画像を生成"}
        </button>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div>
          {spot.catch_copy && (
            <p className="text-xs text-brand-dark">{spot.catch_copy}</p>
          )}
          <p className="mt-0.5 text-[11px] text-slate-400">
            by {spot.author_name}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <ThemeBadge theme={spot.image_theme} />
          <Tag>{labelOf(GENRES, spot.genre)}</Tag>
          <Tag>{labelOf(PLACE_TYPES, spot.place_type)}</Tag>
          {spot.mood && <Tag>{labelOf(MOODS, spot.mood)}</Tag>}
        </div>

        {spot.legend_title && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-bold text-amber-700">
              👑 {spot.legend_title}
            </p>
            {spot.legend_tagline && (
              <p className="mt-0.5 text-[11px] italic text-amber-600">
                {spot.legend_tagline}
              </p>
            )}
            <p className="mt-1 text-xs leading-relaxed text-amber-800">
              {spot.legend_story}
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-1 text-xs font-bold text-slate-700">物語</h3>
          <p className="text-sm leading-relaxed text-slate-600">{spot.story}</p>
        </div>

        {spot.quest && (
          <div>
            <h3 className="mb-1 text-xs font-bold text-slate-700">クエスト</h3>
            <p className="rounded-lg bg-slate-50 p-2 text-sm text-slate-600">
              🎯 {spot.quest}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <ReactionButton
            emoji="✨"
            label="信じる"
            count={spot.believe_count}
            onClick={() => handleReaction("believe")}
          />
          <ReactionButton
            emoji="🚶"
            label="行った"
            count={spot.visited_count}
            onClick={() => handleReaction("visited")}
          />
          <ReactionButton
            emoji="📍"
            label="行きたい"
            count={spot.want_to_go_count}
            onClick={() => handleReaction("want_to_go")}
          />
        </div>

        <div>
          <h3 className="mb-2 text-xs font-bold text-slate-700">
            噂（コメント）一覧 {comments.length > 0 && `(${comments.length})`}
          </h3>
          <CommentList comments={comments} />
        </div>

        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            maxLength={140}
            placeholder="噂を足してみる…"
            className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-brand"
          />
          <button
            onClick={handlePost}
            disabled={!text.trim() || posting}
            className="w-full rounded-lg bg-brand py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
          >
            {posting ? "投稿中..." : "噂を足す"}
          </button>
        </div>

        {canLegend ? (
          <button
            onClick={handleLegend}
            disabled={legendLoading}
            className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-40"
          >
            {legendLoading ? "伝説を紡いでいます..." : "👑 AIで伝説化する"}
          </button>
        ) : (
          !spot.legend_title && (
            <p className="text-center text-[10px] text-slate-400">
              コメントが3件集まると「AIで伝説化」できます（あと
              {Math.max(0, 3 - comments.length)}件）
            </p>
          )
        )}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand-dark">
      {children}
    </span>
  );
}

function ReactionButton({
  emoji,
  label,
  count,
  onClick,
}: {
  emoji: string;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 rounded-lg border border-slate-200 py-2 text-slate-600 transition hover:border-brand hover:bg-brand/5"
    >
      <span className="text-lg">{emoji}</span>
      <span className="text-[10px]">{label}</span>
      <span className="text-xs font-bold text-slate-700">{count}</span>
    </button>
  );
}
