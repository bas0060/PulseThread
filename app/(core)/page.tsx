import { FeedSortTabs } from "@/components/feed/FeedSortTabs";
import { PostCard } from "@/components/feed/PostCard";
import { RightTrending } from "@/components/layout/RightTrending";
import { auth, getSessionUser } from "@/lib/auth";
import {
  batchAuthorsForIds,
  listPostsSorted,
  listTags,
} from "@/lib/db/queries";
import { getTrendingToday } from "@/lib/trending";
import { FeedSort, Tag } from "@/lib/types";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; tag?: string }>;
}) {
  const sp = await searchParams;
  const sortRaw = sp.sort;
  const sort: FeedSort =
    sortRaw === "new" || sortRaw === "top" ? sortRaw : "hot";

  const tagFilter = sp.tag?.toLowerCase();

  const sessionUser = await getSessionUser();
  const rows = await listPostsSorted(sort, tagFilter, sessionUser?.id);

  const tags = await listTags();
  const tagMap = new Map(tags.map((t) => [t.slug, t]));

  const authorIds = [...new Set(rows.map((r) => r.post.authorId))];
  const authorById = await batchAuthorsForIds(authorIds);
  if (sessionUser && authorById.has(sessionUser.id)) {
    authorById.set(sessionUser.id, sessionUser);
  }

  const trending = getTrendingToday();

  const cards = rows.map((row) => {
    const author = authorById.get(row.post.authorId);
    if (!author) return null;
    return (
      <PostCard
        key={row.post.id}
        post={row.post}
        author={author}
        tagsBySlug={tagMap}
        score={row.score}
        userVote={row.userVote}
      />
    );
  });
  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        <FeedSortTabs current={sort} tag={tagFilter} />
        <div className="space-y-4">
          {cards}
          {rows.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No posts match this filter.
            </p>
          )}
        </div>
      </div>
      <aside className="hidden w-72 shrink-0 space-y-6 lg:block">
        <RightTrending items={trending} />
        {/* <RightTopTags /> */}
      </aside>
    </div>
  );
}