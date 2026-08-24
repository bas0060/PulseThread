import { User } from "@/lib/types";
import { CommentNode } from "./CommentNode";
import { EnrichedCommentNode } from "@/lib/comment-tree";

export function CommentThread({
  tree,
  postAuthorId,
  sessionUser,
}: {
  tree: EnrichedCommentNode[];
  postAuthorId: string;
  sessionUser: User | null;
}) {
  if (tree.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No comments yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {tree.map((node) => (
        <CommentNode
          key={node.id}
          node={node}
          postAuthorId={postAuthorId}
          sessionUser={sessionUser}
        />
      ))}
    </ul>
  );
}