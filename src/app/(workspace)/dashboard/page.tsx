"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileAudio, HardDrive, Heart, Upload } from "lucide-react";
import { AudioFileDTO } from "@/lib/types";
import { formatBytes } from "@/lib/format";
import { StatCard } from "@/components/files/stat-card";
import { FileCard } from "@/components/files/file-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [files, setFiles] = useState<AudioFileDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadFiles() {
    const response = await fetch("/api/files");
    if (response.ok) {
      const result = await response.json();
      setFiles(result.files || []);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/files")
      .then((response) => (response.ok ? response.json() : { files: [] }))
      .then((result) => {
        if (cancelled) return;
        setFiles(result.files || []);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const storageUsed = files.reduce((sum, file) => sum + file.fileSize, 0);
    return {
      total: files.length,
      favorites: files.filter((file) => file.isFavorite).length,
      storageUsed,
    };
  }, [files]);

  const recentFiles = files.slice(0, 3);
  const favoriteFiles = files.filter((file) => file.isFavorite).slice(0, 3);

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">A quiet overview of your private music workspace.</p>
        </div>
        <Link href="/upload">
          <Button>
            <Upload className="size-4" />
            Quick upload
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total uploaded files" value={String(stats.total)} icon={<FileAudio className="size-5" />} />
        <StatCard label="Favorite files" value={String(stats.favorites)} icon={<Heart className="size-5" />} />
        <StatCard label="Storage used" value={formatBytes(stats.storageUsed)} icon={<HardDrive className="size-5" />} />
        <StatCard label="Phase 1 storage" value="Local" icon={<Upload className="size-5" />} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Recent uploads</h2>
            <Link href="/library" className="text-sm text-muted hover:text-white">
              View library
            </Link>
          </div>
          {isLoading ? (
            <p className="rounded-md border border-line bg-panel p-6 text-sm text-muted">Loading library...</p>
          ) : recentFiles.length ? (
            <div className="grid gap-4">
              {recentFiles.map((file) => (
                <FileCard key={file.id} file={file} onChanged={loadFiles} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No files uploaded yet"
              description="Start your archive with a beat, loop, stem, sample, vocal, recording, or project file."
              action={{ href: "/upload", label: "Upload first file", icon: <Upload className="size-4" /> }}
            />
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Favorite files</h2>
            <Link href="/favorites" className="text-sm text-muted hover:text-white">
              View favorites
            </Link>
          </div>
          {isLoading ? (
            <p className="rounded-md border border-line bg-panel p-6 text-sm text-muted">Loading favorites...</p>
          ) : favoriteFiles.length ? (
            <div className="grid gap-4">
              {favoriteFiles.map((file) => (
                <FileCard key={file.id} file={file} onChanged={loadFiles} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No favorites yet"
              description="Star useful files from the library and they will stay close at hand here."
              action={{ href: "/library", label: "Browse library", icon: <Heart className="size-4" /> }}
            />
          )}
        </section>
      </div>
    </div>
  );
}
