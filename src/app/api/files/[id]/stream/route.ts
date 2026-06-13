import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const file = await getPrisma().audioFile.findFirst({
    where: { id, userId: user.id },
    select: { filePath: true, mimeType: true, originalFileName: true },
  });

  if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

  try {
    const fileStats = await stat(file.filePath);
    const stream = createReadStream(file.filePath);

    return new Response(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        "Content-Type": file.mimeType || "application/octet-stream",
        "Content-Length": fileStats.size.toString(),
        "Content-Disposition": `inline; filename="${encodeURIComponent(file.originalFileName)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Stored file is missing" }, { status: 404 });
  }
}
