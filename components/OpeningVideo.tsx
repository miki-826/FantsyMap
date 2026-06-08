"use client";

import { useEffect, useRef, useState } from "react";

export default function OpeningVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [show, setShow] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    // 同一セッション中の再読み込みでは繰り返さない
    if (window.sessionStorage.getItem("opening_seen")) return;
    window.sessionStorage.setItem("opening_seen", "1");
    setShow(true);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (show && v) {
      v.muted = muted;
      v.play().catch(() => {});
    }
    // muted は意図的に依存配列から除外（表示時に一度だけ自動再生する）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // React は muted 属性を DOM プロパティに反映しないことがあるため明示的に同期する
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  function close() {
    setShow(false);
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    setMuted(next);
    v.muted = next;
    if (!next) v.play().catch(() => {});
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src="/opening.mp4"
        className="h-full w-full object-cover"
        autoPlay
        muted={muted}
        playsInline
        onEnded={close}
      />

      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="rounded-full bg-white/15 px-3 py-1.5 text-sm text-white backdrop-blur transition hover:bg-white/25"
        >
          {muted ? "🔇 音声オン" : "🔊 音声オフ"}
        </button>
        <button
          onClick={close}
          className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-slate-800 shadow transition hover:bg-white"
        >
          スキップ ▶
        </button>
      </div>
    </div>
  );
}
