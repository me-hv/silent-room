import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaEnvLogged?: boolean;
};

export function getPrisma() {
  if (process.env.NODE_ENV === "development" && !globalForPrisma.prismaEnvLogged) {
    console.log("DATABASE_URL loaded:", Boolean(process.env.DATABASE_URL));
    globalForPrisma.prismaEnvLogged = true;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      }),
    });
  }

  return globalForPrisma.prisma;
}
