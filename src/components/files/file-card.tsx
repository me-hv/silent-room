"use client";

import { Heart, Trash2 } from "lucide-react";
import { AudioFileDTO } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./audio-player";

type FileCardProps = {
  file: AudioFileDTO;
  onChanged: () => void;
};

export function FileCard({ file, onChanged }: FileCardProps) {
  async function toggleFavorite() {
    await fetch(`/api/files/${file.id}/favorite`, { method: "PATCH" });
    onChanged();
  }

  async function deleteFile() {
    const confirmed = window.confirm(`Delete "${file.title}" from Silent Room?`);
    if (!confirmed) return;

    await fetch(`/api/files/${file.id}`, { method: "DELETE" });
    onChanged();
  }

  return (
    <article className="rounded-md border border-line bg-panel p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">{file.title}</h3>
          <p className="mt-1 truncate text-xs text-muted">{file.originalFileName}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            className="size-9 px-0"
            onClick={toggleFavorite}
            title={file.isFavorite ? "Remove favorite" : "Add favorite"}
            aria-label={file.isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <Heart className={file.isFavorite ? "size-4 fill-white text-white" : "size-4"} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="size-9 px-0 hover:text-red-200"
            onClick={deleteFile}
            title="Delete file"
            aria-label="Delete file"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{file.category}</Badge>
        {file.genre ? <Badge>{file.genre}</Badge> : null}
        {file.mood ? <Badge>{file.mood}</Badge> : null}
        {file.bpm ? <Badge>{file.bpm} BPM</Badge> : null}
        {file.musicalKey ? <Badge>{file.musicalKey}</Badge> : null}
        {file.tags.map((tag) => (
          <Badge key={tag}>#{tag}</Badge>
        ))}
      </div>

      {file.isPlayable && file.streamUrl ? (
        <div className="mt-4">
          <AudioPlayer src={file.streamUrl} />
        </div>
      ) : null}

      {file.notes ? <p className="mt-4 line-clamp-3 text-sm text-neutral-300">{file.notes}</p> : null}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span>{formatDate(file.createdAt)}</span>
        <span>{formatBytes(file.fileSize)}</span>
      </div>
    </article>
  );
}
