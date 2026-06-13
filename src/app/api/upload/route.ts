import path from "node:path";
import { writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import {
  audioFileInclude,
  ensureUploadDirectory,
  isAllowedFile,
  parseTags,
  safeStoredName,
  serializeAudioFile,
  uploadDirectory,
} from "@/lib/files";
import { metadataSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a file to upload" }, { status: 400 });
  }

  if (!isAllowedFile(file.name)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const parsed = metadataSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    genre: formData.get("genre") || "",
    mood: formData.get("mood") || "",
    bpm: formData.get("bpm") || "",
    musicalKey: formData.get("musicalKey") || "",
    tags: formData.get("tags") || "",
    notes: formData.get("notes") || "",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid upload data" }, { status: 400 });
  }

  await ensureUploadDirectory();
  const storedName = safeStoredName(file.name);
  const filePath = path.join(uploadDirectory(), storedName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  const tags = parseTags(parsed.data.tags);
  const audioFile = await getPrisma().audioFile.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      originalFileName: file.name,
      filePath,
      mimeType: file.type || "application/octet-stream",
      category: parsed.data.category,
      genre: parsed.data.genre || null,
      mood: parsed.data.mood || null,
      bpm: parsed.data.bpm === "" ? null : parsed.data.bpm,
      musicalKey: parsed.data.musicalKey || null,
      notes: parsed.data.notes || null,
      fileSize: file.size,
      duration: null,
      audioFileTags: {
        create: tags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { userId_name: { userId: user.id, name } },
              create: { userId: user.id, name },
            },
          },
        })),
      },
    },
    include: audioFileInclude,
  });

  return NextResponse.json({ file: serializeAudioFile(audioFile) }, { status: 201 });
}
