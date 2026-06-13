import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextInput({ label, error, className, id, ...props }: TextInputProps) {
  const inputId = id || props.name;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-300">{label}</span>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        className={cn(
          "h-11 w-full rounded-md border border-line bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-2 focus:ring-white/10",
          error && "border-red-900/70 focus:border-red-700 focus:ring-red-900/20",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={inputId ? `${inputId}-error` : undefined} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </label>
  );
}
