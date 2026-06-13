import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { audioFileInclude, serializeAudioFile } from "@/lib/files";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const existingFile = await getPrisma().audioFile.findFirst({
    where: { id, userId: user.id },
    select: { id: true, isFavorite: true },
  });

  if (!existingFile) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const file = await getPrisma().audioFile.update({
    where: { id },
    data: { isFavorite: !existingFile.isFavorite },
    include: audioFileInclude,
  });

  return NextResponse.json({ file: serializeAudioFile(file) });
}
