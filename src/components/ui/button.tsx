import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "border-white bg-white text-black hover:bg-neutral-200",
  secondary: "border-line bg-panel-soft text-white hover:bg-neutral-800",
  ghost: "border-transparent bg-transparent text-muted hover:bg-panel-soft hover:text-white",
  danger: "border-red-900/60 bg-red-950/40 text-red-200 hover:bg-red-900/40",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
