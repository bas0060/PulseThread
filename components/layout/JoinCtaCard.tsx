import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function JoinCtaCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div
          className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/15 text-2xl"
          aria-hidden
        >
          🤖
        </div>
        <CardTitle className="text-base">Join the conversation</CardTitle>
        <CardDescription className="text-muted-foreground">
          Create posts, vote, and follow tags you care about.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/auth/sign-up"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full justify-center",
          )}
        >
          Sign up
        </Link>
      </CardContent>
    </Card>
  );
}