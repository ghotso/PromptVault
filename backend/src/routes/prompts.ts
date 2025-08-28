import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

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
  const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const prompt = await tx.prompt.create({
      data: { 
        title, 
        body, 
        variables, 
        notes, 
        modelHints, 
        userId,
        isPubliclyShared: false,
        visibility: 'PRIVATE'
      },
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
  visibility: z.enum(["PRIVATE", "TEAM"]).optional()
});

router.put("/:id", requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { id } = req.params;
  const { userId } = req.auth!;
  const exists = await prisma.prompt.findFirst({ where: { id, userId } });
  if (!exists) return res.status(404).json({ error: "Not found" });

  const { title, body, variables, notes, modelHints, tags, visibility } = parsed.data;
  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
    prompts.map(async (p: any) => {
      const versionCount = await prisma.promptVersion.count({
        where: { promptId: p.id }
      });
      
      return {
        ...p,
        avgRating: p.ratings.length ? p.ratings.reduce((a: number, r: any) => a + r.value, 0) / p.ratings.length : 0,
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
  
  // Delete related data first
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Delete prompt tags (only the relationships, not the tags themselves)
    await tx.promptTag.deleteMany({ where: { promptId: id } });
    // Delete prompt versions
    await tx.promptVersion.deleteMany({ where: { promptId: id } });
    // Delete ratings
    await tx.rating.deleteMany({ where: { promptId: id } });
    // Finally delete the prompt
    await tx.prompt.delete({ where: { id } });
  });
  
  return res.json({ ok: true });
});

const visibilitySchema = z.object({ visibility: z.enum(["PRIVATE", "TEAM"]) });

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

// Team feed endpoint
router.get("/feed/team", requireAuth, async (req, res) => {
  const { userId } = req.auth!;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { team: true }
  });
  
  if (!user?.team) {
    return res.status(404).json({ error: "No team assigned" });
  }
  
  const teamPrompts = await prisma.prompt.findMany({
    where: { 
      user: { team: user.team },
      visibility: "TEAM"
    },
    include: { 
      user: { select: { name: true, email: true } },
      tags: { include: { tag: true } },
      versions: true
    },
    orderBy: { updatedAt: "desc" }
  });
  
  return res.json(teamPrompts);
});

export default router;


