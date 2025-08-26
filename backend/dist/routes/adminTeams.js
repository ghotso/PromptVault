"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/teams", auth_1.requireAuth, auth_1.requireAdmin, async (_req, res) => {
    const teams = await prisma_1.prisma.team.findMany({ orderBy: { name: "asc" } });
    return res.json(teams);
});
router.post("/teams", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const name = req.body?.name?.trim();
    if (!name)
        return res.status(400).json({ error: "Name required" });
    const team = await prisma_1.prisma.team.create({ data: { name } });
    return res.json(team);
});
router.delete("/teams/:id", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const { id } = req.params;
    // First, remove team assignment from all users
    await prisma_1.prisma.user.updateMany({
        where: { team: id },
        data: { team: null }
    });
    // Then delete the team
    await prisma_1.prisma.team.delete({ where: { id } });
    return res.json({ ok: true });
});
exports.default = router;
