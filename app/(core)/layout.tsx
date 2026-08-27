import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { getSessionUser } from "@/lib/auth";
import { tagPostCounts } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function CoreGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const tags = await tagPostCounts();
  return (
    <>
      <Navbar />
      <div className="mx-auto flex max-w-[1200px] gap-8 px-4 pb-16 pt-2">
        <LeftSidebar showCta={!user} tagsWithCounts={tags} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
}