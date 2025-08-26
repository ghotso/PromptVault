"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    body: zod_1.z.string().min(1),
    variables: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    modelHints: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
router.post("/", auth_1.requireAuth, async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Invalid input" });
    const { title, body, variables, notes, modelHints, tags } = parsed.data;
    const { userId } = req.auth;
    const created = await prisma_1.prisma.$transaction(async (tx) => {
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
    visibility: zod_1.z.enum(["PRIVATE", "TEAM", "PUBLIC"]).optional()
});
router.put("/:id", auth_1.requireAuth, async (req, res) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Invalid input" });
    const { id } = req.params;
    const { userId } = req.auth;
    const exists = await prisma_1.prisma.prompt.findFirst({ where: { id, userId } });
    if (!exists)
        return res.status(404).json({ error: "Not found" });
    const { title, body, variables, notes, modelHints, tags, visibility } = parsed.data;
    const updated = await prisma_1.prisma.$transaction(async (tx) => {
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
router.get("/", auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const prompts = await prisma_1.prisma.prompt.findMany({
        where: { userId },
        include: { tags: { include: { tag: true } }, ratings: true },
        orderBy: { updatedAt: "desc" },
    });
    // Get prompts with version counts
    const promptsWithCounts = await Promise.all(prompts.map(async (p) => {
        const versionCount = await prisma_1.prisma.promptVersion.count({
            where: { promptId: p.id }
        });
        return {
            ...p,
            avgRating: p.ratings.length ? p.ratings.reduce((a, r) => a + r.value, 0) / p.ratings.length : 0,
            _count: { versions: versionCount }
        };
    }));
    return res.json(promptsWithCounts);
});
router.get("/:id", auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { id } = req.params;
    const prompt = await prisma_1.prisma.prompt.findFirst({
        where: { id, userId },
        include: { versions: { orderBy: { createdAt: "desc" } }, tags: { include: { tag: true } }, ratings: true },
    });
    if (!prompt)
        return res.status(404).json({ error: "Not found" });
    return res.json(prompt);
});
router.delete("/:id", auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { id } = req.params;
    const exists = await prisma_1.prisma.prompt.findFirst({ where: { id, userId } });
    if (!exists)
        return res.status(404).json({ error: "Not found" });
    await prisma_1.prisma.prompt.delete({ where: { id } });
    return res.json({ ok: true });
});
const visibilitySchema = zod_1.z.object({ visibility: zod_1.z.enum(["PRIVATE", "TEAM", "PUBLIC"]) });
router.put("/:id/visibility", auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { id } = req.params;
    const parsed = visibilitySchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Invalid input" });
    const prompt = await prisma_1.prisma.prompt.findFirst({ where: { id, userId } });
    if (!prompt)
        return res.status(404).json({ error: "Not found" });
    const updated = await prisma_1.prisma.prompt.update({ where: { id }, data: { visibility: parsed.data.visibility } });
    return res.json(updated);
});
// Team feed endpoint
router.get("/feed/team", auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { team: true }
    });
    if (!user?.team) {
        return res.status(404).json({ error: "No team assigned" });
    }
    const teamPrompts = await prisma_1.prisma.prompt.findMany({
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
exports.default = router;
