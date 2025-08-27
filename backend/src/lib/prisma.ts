import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma || new PrismaClient({ log: ["error", "warn"] });

// Configure SQLite for better compatibility and stability
// Disable WAL mode to avoid file permission issues
if (process.env.NODE_ENV === "production") {
  // Apply SQLite pragmas after client creation
  prisma.$executeRawUnsafe('PRAGMA journal_mode=DELETE;').catch(() => {});
  prisma.$executeRawUnsafe('PRAGMA locking_mode=NORMAL;').catch(() => {});
  prisma.$executeRawUnsafe('PRAGMA busy_timeout=5000;').catch(() => {});
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}


