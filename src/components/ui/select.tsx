import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-line bg-neutral-950 px-3 text-sm text-white outline-none transition focus:border-neutral-500",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
