"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Heart, Library, Settings, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/library", label: "Library", icon: Library },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-line bg-black/50 px-4 py-5 lg:block">
      <Link href="/dashboard" className="flex items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-md border border-line bg-panel-soft font-mono text-sm font-semibold">
          SR
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Silent Room</p>
          <p className="text-xs text-muted">Private archive</p>
        </div>
      </Link>
      <nav className="mt-8 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted transition hover:bg-panel-soft hover:text-white",
                active && "bg-panel-soft text-white",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
