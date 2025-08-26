"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, async (req, res) => {
    const { q } = req.query;
    const userId = req.auth.userId;
    if (!q || q.trim().length === 0)
        return res.json([]);
    // Use FTS5 virtual table if available
    const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
    if (dbUrl.startsWith("file:")) {
        const sqlitePath = dbUrl.replace("file:", "");
        const absDb = path_1.default.resolve(process.cwd(), sqlitePath);
        try {
            const db = new better_sqlite3_1.default(absDb, { readonly: true });
            const stmt = db.prepare("SELECT pid FROM PromptSearch WHERE PromptSearch MATCH ? LIMIT 50");
            const ids = stmt
                .all(q)
                .map((r) => String(r.pid));
            db.close();
            if (ids.length === 0)
                return res.json([]);
            const prompts = await prisma_1.prisma.prompt.findMany({
                where: { userId, id: { in: ids } },
                include: { tags: { include: { tag: true } } },
            });
            return res.json(prompts);
        }
        catch {
            // Fallback below
        }
    }
    const prompts = await prisma_1.prisma.prompt.findMany({
        where: {
            userId,
            OR: [
                { title: { contains: q } },
                { body: { contains: q } },
                { tags: { some: { tag: { name: { contains: q } } } } },
            ],
        },
        include: { tags: { include: { tag: true } } },
        take: 50,
    });
    return res.json(prompts);
});
exports.default = router;
