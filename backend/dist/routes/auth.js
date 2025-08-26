"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../lib/env");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const credsSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(1).optional(),
});
router.post("/register", async (req, res) => {
    const parsed = credsSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Invalid input" });
    const { email, password, name } = parsed.data;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ error: "Email in use" });
    const hash = await bcryptjs_1.default.hash(password, 10);
    const userCount = await prisma_1.prisma.user.count();
    // Enforce allowRegistration setting unless first user
    if (userCount > 0) {
        const settings = await prisma_1.prisma.settings.upsert({ where: { id: 1 }, create: {}, update: {} });
        if (!settings.allowRegistration)
            return res.status(403).json({ error: "Registration disabled" });
    }
    const user = await prisma_1.prisma.user.create({ data: { email, password: hash, name, role: userCount === 0 ? "ADMIN" : "USER" } });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, (0, env_1.getJwtSecret)(), { expiresIn: "7d" });
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 3600 * 1000,
    });
    return res.json({ id: user.id, email: user.email, name: user.name, team: user.team ?? null, role: user.role });
});
router.post("/login", async (req, res) => {
    const parsed = credsSchema.pick({ email: true, password: true }).safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Invalid input" });
    const { email, password } = parsed.data;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcryptjs_1.default.compare(password, user.password);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, (0, env_1.getJwtSecret)(), { expiresIn: "7d" });
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 3600 * 1000,
    });
    return res.json({ id: user.id, email: user.email, name: user.name, team: user.team ?? null, role: user.role });
});
router.post("/logout", async (_req, res) => {
    res.clearCookie("token");
    return res.json({ ok: true });
});
router.get("/me", async (req, res) => {
    const token = req.cookies?.token;
    if (!token)
        return res.status(200).json({ user: null });
    try {
        const payload = jsonwebtoken_1.default.verify(token, (0, env_1.getJwtSecret)());
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, name: true, team: true, role: true } });
        return res.json({ user });
    }
    catch {
        return res.status(200).json({ user: null });
    }
});
router.post("/team", async (req, res) => {
    const token = req.cookies?.token;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const team = req.body?.team?.trim() || null;
        const user = await prisma_1.prisma.user.update({ where: { id: payload.userId }, data: { team }, select: { id: true, email: true, name: true, team: true } });
        return res.json({ user });
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
});
const profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    team: zod_1.z.string().min(1).optional(),
    password: zod_1.z.string().min(8).optional(),
});
router.put("/profile", async (req, res) => {
    const token = req.cookies?.token;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    let userId;
    try {
        const payload = jsonwebtoken_1.default.verify(token, (0, env_1.getJwtSecret)());
        userId = payload.userId;
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Invalid input" });
    const { name, team, password } = parsed.data;
    const data = {};
    if (name !== undefined)
        data.name = name;
    if (team !== undefined)
        data.team = team;
    if (password) {
        data.password = await bcryptjs_1.default.hash(password, 10);
    }
    const user = await prisma_1.prisma.user.update({ where: { id: userId }, data, select: { id: true, email: true, name: true, team: true, role: true } });
    return res.json({ user });
});
exports.default = router;
