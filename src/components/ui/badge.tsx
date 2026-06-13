import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-line bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-300",
        className,
      )}
      {...props}
    />
  );
}
