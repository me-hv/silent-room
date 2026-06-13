import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./button";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: { href: string; label: string; icon?: ReactNode };
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-line bg-panel px-6 py-12 text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? (
        <Link href={action.href} className="mt-6">
          <Button>
            {action.icon}
            {action.label}
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
