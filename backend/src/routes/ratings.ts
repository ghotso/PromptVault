import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const rateSchema = z.object({ value: z.number().int().min(1).max(5) });

router.post("/:promptId", requireAuth, async (req, res) => {
  const { promptId } = req.params;
  const { userId } = req.auth!;
  const parsed = rateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { value } = parsed.data;
  const prompt = await prisma.prompt.findFirst({ where: { id: promptId, userId } });
  if (!prompt) return res.status(404).json({ error: "Not found" });

  const rating = await prisma.rating.upsert({
    where: { userId_promptId: { userId, promptId } },
    update: { value },
    create: { value, userId, promptId },
  }).catch(async () => {
    // In case composite unique not set, fallback: delete existing then create
    await prisma.rating.deleteMany({ where: { userId, promptId } });
    return prisma.rating.create({ data: { value, userId, promptId } });
  });

  return res.json(rating);
});

export default router;


