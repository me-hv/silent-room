import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading: boolean;
  loadingText: string;
};

export function SubmitButton({
  isLoading,
  loadingText,
  children,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || props.disabled}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white bg-white px-4 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
      ) : null}
      {isLoading ? loadingText : children}
    </button>
  );
}
