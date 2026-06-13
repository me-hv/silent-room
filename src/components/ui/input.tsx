import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-line bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500",
        className,
      )}
      {...props}
    />
  );
}
