import { User, Shield, HardDrive } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-muted">Basic account and workspace settings for Phase 1.</p>
      </div>
      <div className="grid max-w-4xl gap-4 md:grid-cols-3">
        {[
          [User, "Profile", "Name and email management placeholder."],
          [Shield, "Security", "Password update flow placeholder."],
          [HardDrive, "Storage", "Local development storage summary placeholder."],
        ].map(([Icon, title, description]) => (
          <section key={String(title)} className="rounded-md border border-line bg-panel p-5">
            <Icon className="size-5 text-neutral-400" />
            <h2 className="mt-4 text-base font-semibold text-white">{String(title)}</h2>
            <p className="mt-2 text-sm text-muted">{String(description)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
