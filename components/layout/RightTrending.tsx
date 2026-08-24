import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrendingItem } from "@/lib/trending";

export function RightTrending({ items }: { items: TrendingItem[] }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Trending today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {items.map((t) => (
          <div key={t.rank} className="flex gap-3 text-sm">
            <span className="font-mono text-lg font-semibold text-muted-foreground">
              {t.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug text-foreground">
                {t.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.postCount} posts
              </p>
            </div>
          </div>
        ))}
        <Link
          href="/?sort=hot"
          className="inline-block text-xs font-medium text-primary hover:text-primary-hover"
        >
          View all
        </Link>
      </CardContent>
    </Card>
  );
}