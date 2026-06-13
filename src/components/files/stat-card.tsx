import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-md border border-line bg-panel p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">{label}</p>
        <div className="text-neutral-400">{icon}</div>
      </div>
      <p className="mt-4 font-mono text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
