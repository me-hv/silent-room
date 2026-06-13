import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { audioFileInclude, parseTags, removeLocalFile, serializeAudioFile } from "@/lib/files";
import { metadataSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const file = await getPrisma().audioFile.findFirst({
    where: { id, userId: user.id },
    include: audioFileInclude,
  });

  if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });
  return NextResponse.json({ file: serializeAudioFile(file) });
}

export async function PUT(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const existingFile = await getPrisma().audioFile.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  });

  if (!existingFile) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = metadataSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid file data" }, { status: 400 });
  }

  const tags = parseTags(parsed.data.tags);
  const prisma = getPrisma();
  await prisma.audioFileTag.deleteMany({ where: { audioFileId: id } });

  const file = await prisma.audioFile.update({
    where: { id },
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      genre: parsed.data.genre || null,
      mood: parsed.data.mood || null,
      bpm: parsed.data.bpm === "" ? null : parsed.data.bpm,
      musicalKey: parsed.data.musicalKey || null,
      notes: parsed.data.notes || null,
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

  return NextResponse.json({ file: serializeAudioFile(file) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const file = await getPrisma().audioFile.findFirst({
    where: { id, userId: user.id },
    select: { id: true, filePath: true },
  });

  if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

  await getPrisma().audioFile.delete({ where: { id } });
  await removeLocalFile(file.filePath);

  return NextResponse.json({ ok: true });
}
