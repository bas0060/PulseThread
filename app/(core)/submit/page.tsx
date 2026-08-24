import { SubmitPostForm } from "@/components/post/SubmitPostForm";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubmitPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div>
      <div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create post</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as u/{user.username}. Posts use tags instead of
            communities.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
      <SubmitPostForm />
    </div>
  );
}