import { Router } from "express";
import { prisma } from "../lib/prisma";
import Database from "better-sqlite3";
import path from "path";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const { q } = req.query as { q?: string };
  const userId = req.auth!.userId;
  if (!q || q.trim().length === 0) return res.json([]);

  // Use FTS5 virtual table if available
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  if (dbUrl.startsWith("file:")) {
    const sqlitePath = dbUrl.replace("file:", "");
    const absDb = path.resolve(process.cwd(), sqlitePath);
    try {
      const db = new Database(absDb, { readonly: true });
      const stmt = db.prepare(
        "SELECT pid FROM PromptSearch WHERE PromptSearch MATCH ? LIMIT 50"
      );
      const ids = stmt
        .all(q)
        .map((r: any) => String(r.pid));
      db.close();
      if (ids.length === 0) return res.json([]);
      const prompts = await prisma.prompt.findMany({
        where: { userId, id: { in: ids } },
        include: { tags: { include: { tag: true } } },
      });
      return res.json(prompts);
    } catch {
      // Fallback below
    }
  }

  const prompts = await prisma.prompt.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: q } },
        { body: { contains: q } },
        { tags: { some: { tag: { name: { contains: q } } } } },
      ],
    },
    include: { tags: { include: { tag: true } } },
    take: 50,
  });
  return res.json(prompts);
});

export default router;


