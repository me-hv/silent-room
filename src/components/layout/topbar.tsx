"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type TopbarProps = {
  user: { name: string; email: string };
};

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-background/90 px-4 backdrop-blur lg:px-8">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{user.name}</p>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/upload">
          <Button className="hidden sm:inline-flex">
            <Upload className="size-4" />
            Quick upload
          </Button>
        </Link>
        <Button variant="ghost" onClick={logout} title="Log out" aria-label="Log out">
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
