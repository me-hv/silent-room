import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { audioFileInclude, serializeAudioFile } from "@/lib/files";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const files = await getPrisma().audioFile.findMany({
    where: { userId: user.id },
    include: audioFileInclude,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ files: files.map(serializeAudioFile) });
}
