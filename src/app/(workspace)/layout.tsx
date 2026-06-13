import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return <AppShell user={{ name: user.name, email: user.email }}>{children}</AppShell>;
}
