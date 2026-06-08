import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "空想MAP — 現実の街に空想を重ねよう",
  description:
    "現実の地図上に、空想スポット・物語・写真風カードを重ねるWebアプリ。誰でも好きな名前で投稿できます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
