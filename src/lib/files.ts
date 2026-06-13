import path from "node:path";
import { mkdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import crypto from "node:crypto";
import { allowedExtensions, playableExtensions } from "./validations";

export const audioFileInclude = {
  audioFileTags: {
    include: {
      tag: true,
    },
  },
} as const;

export function uploadDirectory() {
  const configured = process.env.UPLOAD_DIR || "./storage/uploads";
  return path.isAbsolute(configured)
    ? configured
    : path.join(/* turbopackIgnore: true */ process.cwd(), configured);
}

export async function ensureUploadDirectory() {
  await mkdir(uploadDirectory(), { recursive: true });
}

export function getExtension(fileName: string) {
  return path.extname(fileName).toLowerCase();
}

export function isAllowedFile(fileName: string) {
  return allowedExtensions.includes(getExtension(fileName) as (typeof allowedExtensions)[number]);
}

export function isPlayableFile(fileName: string, mimeType?: string) {
  const extension = getExtension(fileName);
  return (
    playableExtensions.includes(extension as (typeof playableExtensions)[number]) ||
    Boolean(mimeType?.startsWith("audio/"))
  );
}

export function safeStoredName(originalFileName: string) {
  const extension = getExtension(originalFileName);
  return `${crypto.randomUUID()}${extension}`;
}

export function parseTags(value?: string | null) {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ).slice(0, 12);
}

export async function removeLocalFile(filePath?: string | null) {
  if (!filePath || !existsSync(filePath)) return;
  await unlink(filePath);
}

export function serializeAudioFile(
  file: {
    id: string;
    title: string;
    originalFileName: string;
    mimeType: string;
    category: string;
    genre: string | null;
    mood: string | null;
    bpm: number | null;
    musicalKey: string | null;
    notes: string | null;
    isFavorite: boolean;
    fileSize: number;
    duration: number | null;
    createdAt: Date;
    updatedAt: Date;
    audioFileTags: { tag: { name: string } }[];
  },
) {
  const playable = isPlayableFile(file.originalFileName, file.mimeType);

  return {
    id: file.id,
    title: file.title,
    originalFileName: file.originalFileName,
    mimeType: file.mimeType,
    category: file.category,
    genre: file.genre,
    mood: file.mood,
    bpm: file.bpm,
    musicalKey: file.musicalKey,
    notes: file.notes,
    isFavorite: file.isFavorite,
    fileSize: file.fileSize,
    duration: file.duration,
    tags: file.audioFileTags.map((audioFileTag) => audioFileTag.tag.name),
    isPlayable: playable,
    streamUrl: playable ? `/api/files/${file.id}/stream` : null,
    createdAt: file.createdAt.toISOString(),
    updatedAt: file.updatedAt.toISOString(),
  };
}
