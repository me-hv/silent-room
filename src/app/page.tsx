import Link from "next/link";
import { ArrowRight, Headphones, Lock, Music2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded border border-line bg-panel px-3 py-1 text-xs text-muted">
            <Lock className="size-3.5" />
            Private producer archive
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-normal text-white md:text-7xl">Silent Room</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-300">
            Your private music workspace. Upload beats, samples, stems, project files, notes, and tags into one clean
            studio-grade library.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login">
              <Button>
                Get Started
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-md border border-line bg-panel p-4 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-sm font-semibold text-white">Library Monitor</p>
              <p className="text-xs text-muted">Session files, loops, and stems</p>
            </div>
            <Headphones className="size-5 text-neutral-400" />
          </div>
          <div className="mt-5 grid gap-4">
            {[
              ["midnight-pad-loop.wav", "loop", "dark ambient", "F min"],
              ["drum-rack-v3.zip", "project", "hip hop", "92 BPM"],
              ["hook-vocal-stack.m4a", "vocal", "smooth", "A min"],
            ].map(([title, type, mood, detail]) => (
              <div key={title} className="rounded-md border border-line bg-neutral-950 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {type} · {mood} · {detail}
                    </p>
                  </div>
                  <Tags className="size-4 shrink-0 text-neutral-500" />
                </div>
                <div className="mt-4 flex h-12 items-end gap-1">
                  {Array.from({ length: 36 }).map((_, index) => (
                    <span
                      key={index}
                      className="w-full rounded-t bg-neutral-500"
                      style={{ height: `${18 + ((index * 17) % 30)}px` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-md border border-line bg-neutral-950 p-4">
            <Music2 className="size-5 text-neutral-400" />
            <p className="text-sm text-neutral-300">Search by title, genre, mood, category, and tags.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
