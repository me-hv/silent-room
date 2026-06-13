"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function PasswordInput({ label, error, className, id, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id || props.name;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-300">{label}</span>
      <span className="relative block">
        <input
          id={inputId}
          type={isVisible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          className={cn(
            "h-11 w-full rounded-md border border-line bg-neutral-950 px-3 pr-11 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500 focus:ring-2 focus:ring-white/10",
            error && "border-red-900/70 focus:border-red-700 focus:ring-red-900/20",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded text-neutral-500 transition hover:bg-neutral-900 hover:text-white"
          aria-label={isVisible ? "Hide password" : "Show password"}
          title={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </span>
      {error ? (
        <p id={inputId ? `${inputId}-error` : undefined} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </label>
  );
}
