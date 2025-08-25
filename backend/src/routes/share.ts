import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/:id/public", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.auth!;
  const prompt = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!prompt) return res.status(404).json({ error: "Not found" });
  const updated = await prisma.prompt.update({ where: { id }, data: { visibility: "PUBLIC" } });
  const origin = process.env.PUBLIC_ORIGIN || process.env.CLIENT_ORIGIN || "http://localhost:5173";
  return res.json({ publicUrl: `${origin}/public/${updated.id}` });
});

router.get("/public/:id", async (req, res) => {
  const { id } = req.params;
  const prompt = await prisma.prompt.findFirst({
    where: { id, visibility: "PUBLIC" },
    select: { id: true, title: true, body: true, notes: true, modelHints: true, createdAt: true, updatedAt: true },
  });
  if (!prompt) return res.status(404).json({ error: "Not found" });
  return res.json(prompt);
});

export default router;


