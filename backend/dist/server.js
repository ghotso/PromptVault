"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const prompts_1 = __importDefault(require("./routes/prompts"));
const search_1 = __importDefault(require("./routes/search"));
const ratings_1 = __importDefault(require("./routes/ratings"));
const share_1 = __importDefault(require("./routes/share"));
const importExport_1 = __importDefault(require("./routes/importExport"));
const tags_1 = __importDefault(require("./routes/tags"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./lib/db");
const fs_1 = __importDefault(require("fs"));
const admin_1 = __importDefault(require("./routes/admin"));
const adminTeams_1 = __importDefault(require("./routes/adminTeams"));
const prisma_1 = require("./lib/prisma");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.get("/health", (_req, res) => res.json({ ok: true }));
// Public settings endpoint (no auth required)
app.get("/settings", async (_req, res) => {
    try {
        const settings = await prisma_1.prisma.settings.findFirst();
        if (settings) {
            res.json({ allowRegistration: settings.allowRegistration });
        }
        else {
            // Default to allowing registration if no settings exist
            res.json({ allowRegistration: true });
        }
    }
    catch (error) {
        console.error('Failed to fetch public settings:', error);
        // Default to allowing registration on error
        res.json({ allowRegistration: true });
    }
});
app.use("/auth", auth_1.default);
app.use("/prompts", prompts_1.default);
app.use("/search", search_1.default);
app.use("/ratings", ratings_1.default);
app.use("/share", share_1.default);
app.use("/import-export", importExport_1.default);
app.use("/tags", tags_1.default);
app.use("/admin", admin_1.default);
app.use("/admin", adminTeams_1.default);
const port = Number(process.env.PORT || 8080);
// Apply FTS5 setup for SQLite
const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
if (dbUrl.startsWith("file:")) {
    const sqlitePath = dbUrl.replace("file:", "");
    const absDb = path_1.default.resolve(process.cwd(), sqlitePath);
    const ftsSql = path_1.default.resolve(process.cwd(), "scripts/sql/fts5.sql");
    (0, db_1.applyFtsIfNeeded)(absDb, ftsSql);
}
// In production, serve frontend build statically
const frontendDist = path_1.default.resolve(process.cwd(), "frontend/dist");
if (fs_1.default.existsSync(frontendDist)) {
    app.use(express_1.default.static(frontendDist));
    app.get("*", (_req, res) => {
        res.sendFile(path_1.default.join(frontendDist, "index.html"));
    });
}
app.listen(port, () => console.log(`Backend listening on :${port}`));
