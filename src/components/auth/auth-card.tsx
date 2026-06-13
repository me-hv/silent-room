import Link from "next/link";
import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <section className="w-full max-w-[28rem] rounded-md border border-line bg-panel p-7 shadow-2xl shadow-black/30 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-300 transition hover:text-white"
        >
          <span className="flex size-8 items-center justify-center rounded-md border border-line bg-neutral-950 font-mono text-xs text-white">
            SR
          </span>
          Silent Room
        </Link>
        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-normal text-white">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
