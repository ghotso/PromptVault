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

// Health check endpoint
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

// Serve frontend static files BEFORE API routes
const frontendDist = path.resolve(__dirname, "../frontend/dist");
console.log('Frontend dist path:', frontendDist);
console.log('Frontend dist exists:', fs.existsSync(frontendDist));

if (fs.existsSync(frontendDist)) {
  console.log('Serving frontend from:', frontendDist);
  // Serve static files from frontend/dist
  app.use(express.static(frontendDist));
  
  // Catch-all route for frontend routing (must be AFTER static files but BEFORE API routes)
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/auth') || 
        req.path.startsWith('/prompts') || 
        req.path.startsWith('/search') || 
        req.path.startsWith('/ratings') || 
        req.path.startsWith('/share') || 
        req.path.startsWith('/import-export') || 
        req.path.startsWith('/tags') || 
        req.path.startsWith('/admin') ||
        req.path === '/health' ||
        req.path === '/settings') {
      return next();
    }
    
    // Serve index.html for all other routes (frontend routing)
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  console.log('Frontend dist not found at:', frontendDist);
}

// API routes (registered AFTER static file serving)
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

app.listen(port, () => console.log(`Backend listening on :${port}`));


