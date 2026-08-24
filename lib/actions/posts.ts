"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "../auth";
import { getUserVote } from "../db/queries";
import { prisma } from "../prisma";
import { Post } from "../types";
import { PostModel } from "../generated/prisma/models";
import { redirect } from "next/navigation";

export async function votePostAction(postId: string, value: -1 | 1) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { error: "Sign in to vote." };
  }

  await votePost(userId, postId, value);
  revalidatePath("/");
  revalidatePath(`/post/${postId}`);
}

export async function votePost(
  userId: string,
  postId: string,
  value: -1 | 1,
): Promise<void> {
  const current = await getUserVote(userId, "post", postId);
  let next: -1 | 0 | 1 = value;
  if (current === value) next = 0;

  await prisma.vote.deleteMany({
    where: {
      userId,
      targetType: "post",
      targetId: postId,
    },
  });

  if (next !== 0) {
    await prisma.vote.create({
      data: {
        userId,
        targetType: "post",
        targetId: postId,
        value: next,
      },
    });
  }
}

export type PostFormState = { error?: string } | null;

export async function createPostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { error: "You must be signed in to post." };
  }

  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");

  if (title.trim().length < 4) {
    return { error: "Title is too short." };
  }

  const tagSlugs = tagsRaw
    .split(/[,#\s]+/)
    .map((s) => s.trim().toLowerCase())
    .slice(0, 5);

  const post = await addPost({
    authorId: userId,
    title,
    body,
    tagSlugs,
  });

  revalidatePath("/");
  revalidatePath("/submit");
  redirect(`/post/${post.id}`);
}

export async function addPost(input: {
  authorId: string;
  title: string;
  body: string;
  tagSlugs: string[];
}): Promise<Post> {
  const tagSlugs = input.tagSlugs.length ? input.tagSlugs : ["webdev"];
  await prisma.tag.createMany({
    data: tagSlugs.map((slug) => ({
      slug,
      label: slug,
      hashColor: "#ff00fb",
    })),
    skipDuplicates: true,
  });

  const row = await prisma.post.create({
    data: {
      authorId: input.authorId,
      title: input.title.trim(),
      body: input.body.trim(),
    },
  });

  await prisma.postTag.createMany({
    data: tagSlugs.map((slug) => ({
      postId: row.id,
      tagSlug: slug,
    })),
  });

  return mapPostRow(row, tagSlugs, 0);
}

function mapPostRow(
  row: PostModel,
  tagSlugs: string[],
  commentCount: number,
): Post {
  return {
    id: row.id,
    authorId: row.authorId,
    title: row.title,
    body: row.body,
    tagSlugs,
    createdAt: row.createdAt.toISOString(),
    commentCount,
  };
}