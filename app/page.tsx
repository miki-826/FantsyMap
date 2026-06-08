"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { fetchSpots } from "@/lib/store";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import type { FantasySpot } from "@/lib/types";
import CreateSpotPanel from "@/components/CreateSpotPanel";
import SpotDetailPanel from "@/components/SpotDetailPanel";
import BgmPlayer from "@/components/BgmPlayer";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-slate-400">
      地図を読み込み中…
    </div>
  ),
});

type LatLng = { lat: number; lng: number };

export default function Home() {
  const [spots, setSpots] = useState<FantasySpot[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLatLng, setSelectedLatLng] = useState<LatLng | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [mobileCreateOpen, setMobileCreateOpen] = useState(false);
  const [wideMenuVisible, setWideMenuVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("fantasy_author_name");
    if (saved) setAuthorName(saved);
    fetchSpots().then((s) => {
      setSpots(s);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (authorName) window.localStorage.setItem("fantasy_author_name", authorName);
  }, [authorName]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWideMenuVisible(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // メニュー（左パネル／詳細パネル／モバイルの作成画面）が表示されている間はBGMを鳴らす
  const menuActive =
    wideMenuVisible || mobileCreateOpen || Boolean(selectedId);

  const selectedSpot = useMemo(
    () => spots.find((s) => s.id === selectedId) ?? null,
    [spots, selectedId],
  );

  function handleCreated(spot: FantasySpot) {
    setSpots((prev) => [spot, ...prev]);
    setSelectedId(spot.id);
    setSelectedLatLng(null);
    setMobileCreateOpen(false);
  }

  function handleSpotUpdate(updated: FantasySpot) {
    setSpots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-brand">空想MAP</span>
          <span className="hidden text-xs text-slate-400 sm:inline">
            現実の街に空想を重ねよう
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <BgmPlayer active={menuActive} />
          <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1">
            <span className="text-xs text-slate-400">名前</span>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="名無しの旅人"
              maxLength={20}
              className="w-28 text-sm outline-none"
            />
          </label>
          <span className="hidden rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-400 md:inline">
            {isSupabaseEnabled ? "Supabase接続" : "ローカル保存モード"}
          </span>
          <button
            onClick={() => setMobileCreateOpen(true)}
            className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white md:hidden"
          >
            ＋ 空想をつくる
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1">
        <aside className="hidden w-72 flex-none border-r border-slate-200 bg-white md:block">
          <CreateSpotPanel
            authorName={authorName}
            selectedLatLng={selectedLatLng}
            onCreated={handleCreated}
          />
        </aside>

        <section className="relative min-w-0 flex-1">
          {loaded && (
            <MapView
              spots={spots}
              selectedId={selectedId}
              onSelect={(s) => setSelectedId(s.id)}
              onMapClick={(lat, lng) => {
                setSelectedLatLng({ lat, lng });
                setSelectedId(null);
              }}
            />
          )}
          {selectedLatLng && (
            <div className="pointer-events-none absolute left-1/2 top-3 z-[500] -translate-x-1/2 rounded-full bg-pink-500 px-3 py-1 text-xs text-white shadow">
              📍 場所をマークしました。左パネルで空想を作りましょう
            </div>
          )}
        </section>

        <aside className="hidden w-80 flex-none border-l border-slate-200 bg-white lg:block">
          {selectedSpot ? (
            <SpotDetailPanel
              spot={selectedSpot}
              authorName={authorName}
              onClose={() => setSelectedId(null)}
              onSpotUpdate={handleSpotUpdate}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-400">
              <span className="text-3xl">🗺️</span>
              <p className="text-sm">
                地図上の空想カードをクリックすると、
                <br />
                ここに物語が表示されます。
              </p>
            </div>
          )}
        </aside>
      </main>

      {mobileCreateOpen && (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-white md:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
            <span className="text-sm font-bold text-slate-700">空想をつくる</span>
            <button
              onClick={() => setMobileCreateOpen(false)}
              className="text-slate-400"
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <CreateSpotPanel
              authorName={authorName}
              selectedLatLng={selectedLatLng}
              onCreated={handleCreated}
            />
          </div>
        </div>
      )}

      {selectedSpot && (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-white lg:hidden">
          <SpotDetailPanel
            spot={selectedSpot}
            authorName={authorName}
            onClose={() => setSelectedId(null)}
            onSpotUpdate={handleSpotUpdate}
          />
        </div>
      )}
    </div>
  );
}
