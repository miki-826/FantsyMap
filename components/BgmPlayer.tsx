"use client";

import { useEffect, useRef, useState } from "react";

const SRC = "/bgm.mp3";

export default function BgmPlayer({ active }: { active: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedEnabled = window.localStorage.getItem("bgm_enabled");
    const savedVolume = window.localStorage.getItem("bgm_volume");
    if (savedEnabled !== null) setEnabled(savedEnabled === "1");
    if (savedVolume !== null) setVolume(Number(savedVolume));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem("bgm_enabled", enabled ? "1" : "0");
    window.localStorage.setItem("bgm_volume", String(volume));
  }, [enabled, volume, ready]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // メニュー表示中かつ有効なら再生、そうでなければ停止
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (enabled && active) {
      audio.play().catch(() => {
        /* 自動再生がブロックされた場合は最初の操作時に再生する */
      });
    } else {
      audio.pause();
    }
  }, [enabled, active]);

  // ブラウザの自動再生ブロック対策：最初のユーザー操作で再生を試みる
  useEffect(() => {
    const kick = () => {
      const audio = audioRef.current;
      if (audio && enabled && active) audio.play().catch(() => {});
      window.removeEventListener("pointerdown", kick);
    };
    window.addEventListener("pointerdown", kick);
    return () => window.removeEventListener("pointerdown", kick);
  }, [enabled, active]);

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1">
      <button
        onClick={() => setEnabled((v) => !v)}
        className="text-base leading-none"
        aria-label={enabled ? "BGMをオフ" : "BGMをオン"}
        title={enabled ? "BGMをオフ" : "BGMをオン"}
      >
        {enabled ? "🔊" : "🔈"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="h-1 w-16 accent-brand"
        aria-label="音量"
      />
      <audio ref={audioRef} src={SRC} loop preload="auto" />
    </div>
  );
}
