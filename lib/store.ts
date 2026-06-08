"use client";

import { isSupabaseEnabled, supabase } from "./supabaseClient";
import { SEED_SPOTS } from "./seedData";
import type { FantasyComment, FantasySpot, ReactionType } from "./types";

const SPOTS_KEY = "fantasy_spots_v1";
const COMMENTS_KEY = "fantasy_comments_v1";

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function levelFromComments(count: number): number {
  if (count >= 8) return 5;
  if (count >= 5) return 4;
  if (count >= 3) return 3;
  if (count >= 1) return 2;
  return 1;
}

/* ---------------- localStorage backend ---------------- */

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded(): FantasySpot[] {
  const existing = readLocal<FantasySpot[] | null>(SPOTS_KEY, null);
  if (existing && existing.length > 0) return existing;
  writeLocal(SPOTS_KEY, SEED_SPOTS);
  return SEED_SPOTS;
}

/* ---------------- public API ---------------- */

export async function fetchSpots(): Promise<FantasySpot[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("fantasy_spots")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as FantasySpot[]) ?? [];
  }
  const spots = ensureSeeded();
  return [...spots].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export type NewSpotInput = {
  title: string;
  catch_copy: string | null;
  story: string;
  quest: string | null;
  tags: string[];
  image_theme: string;
  latitude: number;
  longitude: number;
  seed_text: string;
  genre: string;
  place_type: string;
  mood: string | null;
  generation_type: "template" | "ai";
  author_name: string;
};

export async function createSpot(input: NewSpotInput): Promise<FantasySpot> {
  const now = new Date().toISOString();
  const spot: FantasySpot = {
    id: uid(),
    legend_title: null,
    legend_story: null,
    legend_tagline: null,
    location_name: null,
    image_url: null,
    user_id: null,
    is_public: true,
    level: 1,
    comment_count: 0,
    believe_count: 0,
    visited_count: 0,
    want_to_go_count: 0,
    created_at: now,
    updated_at: now,
    ...input,
  };

  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("fantasy_spots")
      .insert({ ...input, is_public: true })
      .select()
      .single();
    if (error) throw error;
    return data as FantasySpot;
  }

  const spots = ensureSeeded();
  writeLocal(SPOTS_KEY, [spot, ...spots]);
  return spot;
}

export async function fetchComments(spotId: string): Promise<FantasyComment[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("fantasy_comments")
      .select("*")
      .eq("spot_id", spotId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as FantasyComment[]) ?? [];
  }
  const all = readLocal<FantasyComment[]>(COMMENTS_KEY, []);
  return all
    .filter((c) => c.spot_id === spotId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function addComment(
  spotId: string,
  text: string,
  authorName: string,
): Promise<{ comment: FantasyComment; level: number; commentCount: number }> {
  const now = new Date().toISOString();
  const comment: FantasyComment = {
    id: uid(),
    spot_id: spotId,
    comment_text: text,
    author_name: authorName,
    user_id: null,
    created_at: now,
  };

  if (isSupabaseEnabled && supabase) {
    const { error: cErr } = await supabase.from("fantasy_comments").insert({
      spot_id: spotId,
      comment_text: text,
      author_name: authorName,
    });
    if (cErr) throw cErr;
    const { count } = await supabase
      .from("fantasy_comments")
      .select("*", { count: "exact", head: true })
      .eq("spot_id", spotId);
    const commentCount = count ?? 0;
    const level = levelFromComments(commentCount);
    await supabase
      .from("fantasy_spots")
      .update({ comment_count: commentCount, level, updated_at: now })
      .eq("id", spotId);
    return { comment, level, commentCount };
  }

  const all = readLocal<FantasyComment[]>(COMMENTS_KEY, []);
  writeLocal(COMMENTS_KEY, [...all, comment]);

  const spots = ensureSeeded();
  const commentCount = all.filter((c) => c.spot_id === spotId).length + 1;
  const level = levelFromComments(commentCount);
  const updated = spots.map((s) =>
    s.id === spotId ? { ...s, comment_count: commentCount, level, updated_at: now } : s,
  );
  writeLocal(SPOTS_KEY, updated);
  return { comment, level, commentCount };
}

export async function addReaction(
  spotId: string,
  type: ReactionType,
): Promise<FantasySpot | null> {
  const column = `${type}_count` as const;

  if (isSupabaseEnabled && supabase) {
    const { data: current } = await supabase
      .from("fantasy_spots")
      .select(column)
      .eq("id", spotId)
      .single();
    const next = ((current as Record<string, number> | null)?.[column] ?? 0) + 1;
    const { data, error } = await supabase
      .from("fantasy_spots")
      .update({ [column]: next })
      .eq("id", spotId)
      .select()
      .single();
    if (error) throw error;
    await supabase.from("fantasy_reactions").insert({ spot_id: spotId, reaction_type: type });
    return data as FantasySpot;
  }

  const spots = ensureSeeded();
  let updatedSpot: FantasySpot | null = null;
  const updated = spots.map((s) => {
    if (s.id !== spotId) return s;
    updatedSpot = { ...s, [column]: (s[column] as number) + 1 };
    return updatedSpot;
  });
  writeLocal(SPOTS_KEY, updated);
  return updatedSpot;
}

export async function applyLegend(
  spotId: string,
  legend: { legendTitle: string; legendTagline: string; legendStory: string },
): Promise<FantasySpot | null> {
  const now = new Date().toISOString();
  const patch = {
    legend_title: legend.legendTitle,
    legend_tagline: legend.legendTagline,
    legend_story: legend.legendStory,
    level: 5,
    updated_at: now,
  };

  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("fantasy_spots")
      .update(patch)
      .eq("id", spotId)
      .select()
      .single();
    if (error) throw error;
    return data as FantasySpot;
  }

  const spots = ensureSeeded();
  let updatedSpot: FantasySpot | null = null;
  const updated = spots.map((s) => {
    if (s.id !== spotId) return s;
    updatedSpot = { ...s, ...patch };
    return updatedSpot;
  });
  writeLocal(SPOTS_KEY, updated);
  return updatedSpot;
}
