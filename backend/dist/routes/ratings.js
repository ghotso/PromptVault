"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const rateSchema = zod_1.z.object({ value: zod_1.z.number().int().min(1).max(5) });
router.post("/:promptId", auth_1.requireAuth, async (req, res) => {
    const { promptId } = req.params;
    const { userId } = req.auth;
    const parsed = rateSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Invalid input" });
    const { value } = parsed.data;
    const prompt = await prisma_1.prisma.prompt.findFirst({ where: { id: promptId, userId } });
    if (!prompt)
        return res.status(404).json({ error: "Not found" });
    const rating = await prisma_1.prisma.rating.upsert({
        where: { userId_promptId: { userId, promptId } },
        update: { value },
        create: { value, userId, promptId },
    }).catch(async () => {
        // In case composite unique not set, fallback: delete existing then create
        await prisma_1.prisma.rating.deleteMany({ where: { userId, promptId } });
        return prisma_1.prisma.rating.create({ data: { value, userId, promptId } });
    });
    return res.json(rating);
});
exports.default = router;
