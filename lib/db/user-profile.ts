import { prisma } from "../prisma";
import { User } from "../types";

function generateUsername(name: string): string {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 20) || "user";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}_${suffix}`;
}

export async function ensureUserProfile(neon: {
  id: string;
  name: string;
  image?: string | null;
}): Promise<User> {
  const existing = await prisma.userProfile.findUnique({
    where: { id: neon.id },
  });

  if (existing) {
    return {
      id: existing.id,
      username: existing.username,
      displayName: neon.name,
      avatarUrl: neon.image ?? undefined,
    };
  }

  const row = await prisma.userProfile.create({
    data: { id: neon.id, username: generateUsername(neon.name) },
  });

  return {
    id: row.id,
    username: row.username,
    displayName: neon.name,
    avatarUrl: neon.image ?? undefined,
  };
}