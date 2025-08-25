import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/teams", requireAuth, requireAdmin, async (_req, res) => {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  return res.json(teams);
});

router.post("/teams", requireAuth, requireAdmin, async (req, res) => {
  const name = (req.body?.name as string | undefined)?.trim();
  if (!name) return res.status(400).json({ error: "Name required" });
  const team = await prisma.team.create({ data: { name } });
  return res.json(team);
});

router.delete("/teams/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  // First, remove team assignment from all users
  await prisma.user.updateMany({
    where: { team: id },
    data: { team: null }
  });
  
  // Then delete the team
  await prisma.team.delete({ where: { id } });
  return res.json({ ok: true });
});

export default router;


