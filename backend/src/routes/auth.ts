import { Router } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../lib/env";
import { z } from "zod";

const router = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

router.post("/register", async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email in use" });
  const hash = await bcrypt.hash(password, 10);
  const userCount = await prisma.user.count();
  // Enforce allowRegistration setting unless first user
  if (userCount > 0) {
    const settings = await prisma.settings.upsert({ where: { id: 1 }, create: {}, update: {} });
    if (!settings.allowRegistration) return res.status(403).json({ error: "Registration disabled" });
  }
  const user = await prisma.user.create({ data: { email, password: hash, name, role: userCount === 0 ? "ADMIN" : "USER" } });
  const token = jwt.sign({ userId: user.id, role: user.role }, getJwtSecret(), { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 3600 * 1000,
    path: "/",
  });
  return res.json({ id: user.id, email: user.email, name: user.name, team: user.team ?? null, role: user.role });
});

router.post("/login", async (req, res) => {
  console.log("=== LOGIN ATTEMPT DEBUG ===");
  console.log("Email:", req.body?.email);
  console.log("Body:", req.body);
  
  const parsed = credsSchema.pick({ email: true, password: true }).safeParse(req.body);
  if (!parsed.success) {
    console.log("Validation failed:", parsed.error);
    return res.status(400).json({ error: "Invalid input" });
  }
  
  const { email, password } = parsed.data;
  console.log("Looking for user:", email);
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("User not found:", email);
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  console.log("User found:", { id: user.id, email: user.email, role: user.role });
  
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    console.log("Password mismatch for user:", email);
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  console.log("Password verified, generating JWT...");
  const jwtSecret = getJwtSecret();
  console.log("JWT Secret length:", jwtSecret.length);
  
  const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: "7d" });
  console.log("JWT Token generated, length:", token.length);
  
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 3600 * 1000,
    path: "/",
  });
  
  console.log("Cookie set, sending response");
  console.log("=== END LOGIN DEBUG ===");
  
  return res.json({ id: user.id, email: user.email, name: user.name, team: user.team ?? null, role: user.role });
});

router.post("/logout", async (_req, res) => {
  res.clearCookie("token");
  return res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  const token = req.cookies?.token as string | undefined;
  if (!token) return res.status(200).json({ user: null });
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, name: true, team: true, role: true } });
    return res.json({ user });
  } catch {
    return res.status(200).json({ user: null });
  }
});

router.post("/team", async (req, res) => {
  const token = req.cookies?.token as string | undefined;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { userId: string };
    const team = (req.body?.team as string | undefined)?.trim() || null;
    const user = await prisma.user.update({ where: { id: payload.userId }, data: { team }, select: { id: true, email: true, name: true, team: true } });
    return res.json({ user });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  team: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
});

router.put("/profile", async (req, res) => {
  const token = req.cookies?.token as string | undefined;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  let userId: string;
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { userId: string };
    userId = payload.userId;
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { name, team, password } = parsed.data;
  const data: any = {};
  if (name !== undefined) data.name = name;
  if (team !== undefined) data.team = team;
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  const user = await prisma.user.update({ where: { id: userId }, data, select: { id: true, email: true, name: true, team: true, role: true } });
  return res.json({ user });
});

export default router;


