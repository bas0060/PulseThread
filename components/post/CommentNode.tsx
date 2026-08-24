"use client";

import { User } from "@/lib/types";
import { Badge } from "../ui/badge";
import { formatRelativeTime } from "@/lib/format";
import { useState } from "react";
import { VoteButtons } from "../feed/VoteButton";
import { EnrichedCommentNode } from "@/lib/comment-tree";
import { CommentComposer } from "./CommentComposer";

export function CommentNode({
  node,
  postAuthorId,
  sessionUser,
}: {
  node: EnrichedCommentNode;
  postAuthorId: string;
  sessionUser: User | null;
}) {
  const isOp = node.authorId === postAuthorId;
  const [showReply, setShowReply] = useState(false);
  return (
    <li className="relative">
      <div className="flex gap-2">
        <VoteButtons
          target="comment"
          targetId={node.id}
          score={node.score}
          userVote={node.userVote}
        />
        <div className="min-w-0 flex-1 border-l border-border pl-3">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              u/{node.author.username}
            </span>
            {isOp ? (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-semibold uppercase"
              >
                OP
              </Badge>
            ) : null}
            <span>·</span>
            <span>{formatRelativeTime(node.createdAt)}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {node.body}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
            {sessionUser ? (
              <button
                type="button"
                onClick={() => setShowReply((v) => !v)}
                className="hover:text-foreground"
              >
                Reply
              </button>
            ) : null}
            <button type="button" className="hover:text-foreground">
              Share
            </button>
          </div>

          {sessionUser && showReply && (
            <div className="mt-3 border-t border-border pt-3">
              <CommentComposer
                postId={node.postId}
                user={sessionUser}
                parentId={node.id}
                placeholder="Write a reply…"
                compact
              />
            </div>
          )}

          {node.children.length > 0 && (
            <ul className="mt-4 space-y-4 border-l border-border/80 pl-3">
              {node.children.map((ch) => (
                <CommentNode
                  key={ch.id}
                  node={ch}
                  postAuthorId={postAuthorId}
                  sessionUser={sessionUser}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}