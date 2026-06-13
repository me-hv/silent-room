import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-line bg-neutral-950 px-3 py-2 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500",
        className,
      )}
      {...props}
    />
  );
}
