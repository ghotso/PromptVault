import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import promptsRoutes from "./routes/prompts";
import searchRoutes from "./routes/search";
import ratingsRoutes from "./routes/ratings";
import shareRoutes from "./routes/share";
import importExportRoutes from "./routes/importExport";
import tagsRoutes from "./routes/tags";
import path from "path";
import { applyFtsIfNeeded } from "./lib/db";
import fs from "fs";
import adminRoutes from "./routes/admin";
import adminTeamsRoutes from "./routes/adminTeams";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

// Public settings endpoint (no auth required)
app.get("/settings", async (_req, res) => {
  try {
    const settings = await prisma.settings.findFirst();
    if (settings) {
      res.json({ allowRegistration: settings.allowRegistration });
    } else {
      // Default to allowing registration if no settings exist
      res.json({ allowRegistration: true });
    }
  } catch (error) {
    console.error('Failed to fetch public settings:', error);
    // Default to allowing registration on error
    res.json({ allowRegistration: true });
  }
});

app.use("/auth", authRoutes);
app.use("/prompts", promptsRoutes);
app.use("/search", searchRoutes);
app.use("/ratings", ratingsRoutes);
app.use("/share", shareRoutes);
app.use("/import-export", importExportRoutes);
app.use("/tags", tagsRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", adminTeamsRoutes);

const port = Number(process.env.PORT || 8080);
// Apply FTS5 setup for SQLite
const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
if (dbUrl.startsWith("file:")) {
  const sqlitePath = dbUrl.replace("file:", "");
  const absDb = path.resolve(process.cwd(), sqlitePath);
  const ftsSql = path.resolve(process.cwd(), "scripts/sql/fts5.sql");
  applyFtsIfNeeded(absDb, ftsSql);
}

// In production, serve frontend build statically
const frontendDist = path.resolve(process.cwd(), "frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}
app.listen(port, () => console.log(`Backend listening on :${port}`));


