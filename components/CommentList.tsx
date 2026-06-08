import type { FantasyComment } from "@/lib/types";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

export default function CommentList({ comments }: { comments: FantasyComment[] }) {
  if (comments.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-slate-400">
        まだ噂はありません。最初の一言を残してみよう。
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.id} className="flex gap-2">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand/15 text-sm">
            {c.author_name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">
                {c.author_name}
              </span>
              <span className="text-xs text-slate-400">{timeAgo(c.created_at)}</span>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm text-slate-600">
              {c.comment_text}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
