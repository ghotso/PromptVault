"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post("/:id/public", auth_1.requireAuth, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.auth;
    const prompt = await prisma_1.prisma.prompt.findFirst({ where: { id, userId } });
    if (!prompt)
        return res.status(404).json({ error: "Not found" });
    // Generate unique public share ID
    const publicShareId = `share_${Math.random().toString(36).substr(2, 9)}`;
    const updated = await prisma_1.prisma.prompt.update({
        where: { id },
        data: {
            isPubliclyShared: true,
            publicShareId: publicShareId
        }
    });
    const origin = process.env.PUBLIC_ORIGIN || process.env.CLIENT_ORIGIN || "http://localhost:5173";
    return res.json({ publicUrl: `${origin}/share/${publicShareId}` });
});
router.get("/public/:shareId", async (req, res) => {
    const { shareId } = req.params;
    const prompt = await prisma_1.prisma.prompt.findFirst({
        where: {
            publicShareId: shareId,
            isPubliclyShared: true
        },
        select: { id: true, title: true, body: true, notes: true, modelHints: true, createdAt: true, updatedAt: true },
    });
    if (!prompt)
        return res.status(404).json({ error: "Not found" });
    return res.json(prompt);
});
router.delete("/:id/public", auth_1.requireAuth, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.auth;
    const prompt = await prisma_1.prisma.prompt.findFirst({ where: { id, userId } });
    if (!prompt)
        return res.status(404).json({ error: "Not found" });
    const updated = await prisma_1.prisma.prompt.update({
        where: { id },
        data: {
            isPubliclyShared: false,
            publicShareId: null
        }
    });
    return res.json({ success: true });
});
exports.default = router;
