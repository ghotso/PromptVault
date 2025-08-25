import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const createSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  variables: z.string().optional(),
  notes: z.string().optional(),
  modelHints: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { title, body, variables, notes, modelHints, tags } = parsed.data;
  const { userId } = req.auth!;
  const created = await prisma.$transaction(async (tx) => {
    const prompt = await tx.prompt.create({
      data: { title, body, variables, notes, modelHints, userId },
    });
    await tx.promptVersion.create({ data: { promptId: prompt.id, title, body, notes } });
    if (tags && tags.length) {
      for (const tagName of tags) {
        const tag = await tx.tag.upsert({
          where: { name: tagName },
          create: { name: tagName },
          update: {},
        });
        await tx.promptTag.create({ data: { promptId: prompt.id, tagId: tag.id } });
      }
    }
    return prompt;
  });
  return res.json(created);
});

const updateSchema = createSchema.partial().extend({
  visibility: z.enum(["PRIVATE", "TEAM", "PUBLIC"]).optional()
});

router.put("/:id", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { id } = req.params;
  const { userId } = req.auth!;
  const exists = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!exists) return res.status(404).json({ error: "Not found" });

  const { title, body, variables, notes, modelHints, tags, visibility } = parsed.data;
  const updated = await prisma.$transaction(async (tx) => {
    const prompt = await tx.prompt.update({
      where: { id },
      data: { title, body, variables, notes, modelHints, visibility },
    });
    if (title || body || notes) {
      await tx.promptVersion.create({ data: { promptId: id, title: title ?? prompt.title, body: body ?? prompt.body, notes: notes ?? prompt.notes ?? undefined } });
    }
    if (tags) {
      await tx.promptTag.deleteMany({ where: { promptId: id } });
      for (const tagName of tags) {
        const tag = await tx.tag.upsert({ where: { name: tagName }, create: { name: tagName }, update: {} });
        await tx.promptTag.create({ data: { promptId: id, tagId: tag.id } });
      }
    }
    return prompt;
  });
  return res.json(updated);
});

router.get("/", requireAuth, async (req, res) => {
  const { userId } = req.auth!;
  const prompts = await prisma.prompt.findMany({
    where: { userId },
    include: { tags: { include: { tag: true } }, ratings: true },
    orderBy: { updatedAt: "desc" },
  });
  
  // Get prompts with version counts
  const promptsWithCounts = await Promise.all(
    prompts.map(async (p) => {
      const versionCount = await prisma.promptVersion.count({
        where: { promptId: p.id }
      });
      
      return {
        ...p,
        avgRating: p.ratings.length ? p.ratings.reduce((a, r) => a + r.value, 0) / p.ratings.length : 0,
        _count: { versions: versionCount }
      };
    })
  );
  
  return res.json(promptsWithCounts);
});

router.get("/:id", requireAuth, async (req, res) => {
  const { userId } = req.auth!;
  const { id } = req.params;
  const prompt = await prisma.prompt.findFirst({
    where: { id, userId },
    include: { versions: { orderBy: { createdAt: "desc" } }, tags: { include: { tag: true } }, ratings: true },
  });
  if (!prompt) return res.status(404).json({ error: "Not found" });
  return res.json(prompt);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { userId } = req.auth!;
  const { id } = req.params;
  const exists = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!exists) return res.status(404).json({ error: "Not found" });
  await prisma.prompt.delete({ where: { id } });
  return res.json({ ok: true });
});

const visibilitySchema = z.object({ visibility: z.enum(["PRIVATE", "TEAM", "PUBLIC"]) });

router.put("/:id/visibility", requireAuth, async (req, res) => {
  const { userId } = req.auth!;
  const { id } = req.params;
  const parsed = visibilitySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const prompt = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!prompt) return res.status(404).json({ error: "Not found" });
  const updated = await prisma.prompt.update({ where: { id }, data: { visibility: parsed.data.visibility } });
  return res.json(updated);
});

// Team feed: prompts visible to the user's team (excluding private and from other teams)
router.get("/feed/team", requireAuth, async (req, res) => {
  const { userId } = req.auth!;
  const me = await prisma.user.findUnique({ 
    where: { id: userId }, 
    select: { team: true } 
  });
  if (!me?.team) return res.json([]);
  const prompts = await prisma.prompt.findMany({
    where: { 
      visibility: "TEAM", 
      user: { team: me.team } 
    },
    include: { tags: { include: { tag: true } }, ratings: true, user: { select: { id: true, email: true, name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
  
  // Add version counts to team feed prompts
  const promptsWithCounts = await Promise.all(
    prompts.map(async (p) => {
      const versionCount = await prisma.promptVersion.count({
        where: { promptId: p.id }
      });
      
      return {
        ...p,
        _count: { versions: versionCount }
      };
    })
  );
  
  return res.json(promptsWithCounts);
});

export default router;


