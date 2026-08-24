import { VoteButtons } from "@/components/feed/VoteButton";
import { CommentComposer } from "@/components/post/CommentComposer";
import { CommentThread } from "@/components/post/CommentThread";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/auth";
import {
  getAuthorById,
  getCommentTree,
  getPostById,
  getPostScore,
  getUserVote,
  listTags,
} from "@/lib/db/queries";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@neondatabase/auth/react";
import { ArrowLeft, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  const author = await getAuthorById(post.authorId);
  const sessionUser = await getSessionUser();

  const score = await getPostScore(post.id);
  const userVote = await getUserVote(sessionUser?.id, "post", post.id);

  const tags = await listTags();
  const primarySlug = post.tagSlugs[0];
  const primaryTag = primarySlug
    ? tags.find((t) => t.slug === primarySlug)
    : undefined;

  const commentTree = await getCommentTree(post.id, sessionUser?.id);

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to feed
        </Link>

        <article className="rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <UserAvatar user={author} size="sm" />
            <span className="font-medium text-foreground">
              u/{author.username}
            </span>
            <span>·</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>
          <h1 className="text-balance text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {post.title}
          </h1>
          {primaryTag ? (
            <div className="mt-3">
              <Link
                href={`/?tag=${encodeURIComponent(primaryTag.slug)}`}
                className={cn(
                  "inline-flex rounded-md px-2 py-0.5 text-sm font-medium",
                  "bg-tag-bg text-tag-text",
                )}
              >
                #{primaryTag.label}
              </Link>
            </div>
          ) : null}
          <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
            {post.body}
          </div>
          <Separator className="my-6" />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <VoteButtons
                target="post"
                targetId={post.id}
                score={score}
                userVote={userVote}
              />
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="size-4" />
                {post.commentCount} Comments
              </span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <Share2 className="size-4" />
              Share
            </button>
          </div>
        </article>

        <section className="mt-8 rounded-xl border border-border bg-card p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {post.commentCount} Comments
            </h2>
          </div>
          {sessionUser ? (
            <div className="mb-8">
              <CommentComposer postId={post.id} user={sessionUser} />
            </div>
          ) : (
            <p className="mb-8 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <Link
                href="/auth/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Log in
              </Link>{" "}
              to join the discussion.
            </p>
          )}

          <CommentThread
            tree={commentTree}
            postAuthorId={post.authorId}
            sessionUser={sessionUser}
          />
        </section>
      </div>
    </div>
  );
}