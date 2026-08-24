"use client";

import { cn } from "@/lib/utils";
import { Flame, Home, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Tag } from "@/lib/types";
import { LeftTags } from "./LeftTags";
import { JoinCtaCard } from "./JoinCtaCard";

const nav = [
  { href: "/", label: "Home", icon: Home, match: "home" as const },
  { href: "/?sort=hot", label: "Popular", icon: Flame, match: "hot" as const },
  {
    href: "/?sort=new",
    label: "All Posts",
    icon: LayoutGrid,
    match: "new" as const,
  },
];

export function LeftSidebar({
  showCta,
  tagsWithCounts,
}: {
  showCta: boolean;
  tagsWithCounts: { tag: Tag; count: number }[];
}) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const sort = sp.get("sort");

  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <nav className="space-y-1 pr-2">
        {nav.map(({ href, label, icon: Icon, match }) => {
          const active =
            match === "home"
              ? pathname === "/" &&
                sort !== "hot" &&
                sort !== "new" &&
                sort !== "top"
              : match === "hot"
                ? pathname === "/" && sort === "hot"
                : match === "new"
                  ? pathname === "/" && sort === "new"
                  : false;

          return (
            <Link
              key={match}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                active && "border-primary bg-muted/60 text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Top Tags
        </p>
        <LeftTags items={tagsWithCounts} />
      </div>
      {showCta && (
        <div className="mt-8">
          <JoinCtaCard />
        </div>
      )}
    </aside>
  );
}