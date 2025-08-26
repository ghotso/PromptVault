"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/export", auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const data = await prisma_1.prisma.prompt.findMany({
        where: { userId },
        include: { versions: true, tags: { include: { tag: true } }, ratings: true },
    });
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=prompts.json");
    return res.send(JSON.stringify(data, null, 2));
});
router.post("/import", auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const arr = Array.isArray(req.body) ? req.body : [];
    for (const item of arr) {
        const prompt = await prisma_1.prisma.prompt.create({
            data: {
                title: item.title,
                body: item.body,
                variables: item.variables ?? null,
                notes: item.notes ?? null,
                modelHints: item.modelHints ?? null,
                userId,
            },
        });
        await prisma_1.prisma.promptVersion.create({ data: { promptId: prompt.id, title: prompt.title, body: prompt.body, notes: prompt.notes ?? undefined } });
        if (Array.isArray(item.tags)) {
            for (const tagName of item.tags) {
                const tag = await prisma_1.prisma.tag.upsert({ where: { name: tagName }, create: { name: tagName }, update: {} });
                await prisma_1.prisma.promptTag.create({ data: { promptId: prompt.id, tagId: tag.id } });
            }
        }
    }
    return res.json({ ok: true });
});
exports.default = router;
