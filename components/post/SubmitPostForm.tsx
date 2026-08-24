"use client";
import { createPostAction } from "@/lib/actions/posts";
import { useActionState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export function SubmitPostForm() {
  const [state, action, pending] = useActionState(createPostAction, null);

  return (
    <form action={action} className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          minLength={4}
          placeholder="What’s on your mind?"
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          name="body"
          rows={8}
          placeholder="Optional details, links, or context…"
          className="border-border bg-card"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="webdev, react, nextjs"
          className="h-10"
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated. Defaults to #webdev if empty.
        </p>
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Publishing..." : "Publish Post"}
      </Button>
    </form>
  );
}