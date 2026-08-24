import { formatCount } from "@/lib/format";
import { Tag } from "@/lib/types";
import Link from "next/link";

export function LeftTags({ items }: { items: { tag: Tag; count: number }[] }) {
  const sorted = [...items].sort((a, b) => b.count - a.count).slice(0, 8);
  return (
    <ul className="space-y-2">
      {sorted.map(({ tag, count }) => (
        <li key={tag.slug}>
          <Link
            href={`/?tag=${encodeURIComponent(tag.slug)}`}
            className="flex items-center justify-between gap-2 rounded-md py-1 text-sm transition-colors hover:text-foreground"
          >
            <span
              className="truncate font-medium"
              style={{ color: tag.hashColor }}
            >
              #{tag.label}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatCount(count)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}