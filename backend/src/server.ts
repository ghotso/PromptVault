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
import { execSync } from "child_process";
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

// Initialize database and create tables
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // IMPORTANT: Prevent Prisma from auto-creating database
    console.log('Checking if Prisma client is properly initialized...');
    
    // Debug: Check current working directory and environment
    console.log('Current working directory:', process.cwd());
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Ensure data directory exists
    const dbUrl = process.env.DATABASE_URL || "file:/app/backend/data/promptvault.db";
    if (dbUrl.startsWith("file:")) {
      const sqlitePath = dbUrl.replace("file:", "");
      const absDb = path.resolve(process.cwd(), sqlitePath);
      const dataDir = path.dirname(absDb);
      
      console.log('Database path:', absDb);
      console.log('Data directory:', dataDir);
      
      // Debug: Check if directories exist and their permissions
      console.log('Data directory exists:', fs.existsSync(dataDir));
      console.log('Database file exists:', fs.existsSync(absDb));
      
      // List contents of current directory
      try {
        const currentDirContents = fs.readdirSync(process.cwd());
        console.log('Current directory contents:', currentDirContents);
      } catch (e) {
        console.log('Cannot read current directory:', (e as Error).message);
      }
      
      // List contents of data directory if it exists
      if (fs.existsSync(dataDir)) {
        try {
          const dataDirContents = fs.readdirSync(dataDir);
          console.log('Data directory contents:', dataDirContents);
        } catch (e) {
          console.log('Cannot read data directory:', (e as Error).message);
        }
      }
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(dataDir)) {
        console.log('Creating data directory:', dataDir);
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('Data directory created successfully');
      }
      
      // Check if database file exists
      if (!fs.existsSync(absDb)) {
        console.log('Database file does not exist, creating proper SQLite database...');
        // Create a proper SQLite database file using the sqlite command
        try {
          execSync(`sqlite3 "${absDb}" "VACUUM;"`, { stdio: 'pipe' });
          console.log('SQLite database file created successfully');
        } catch (e) {
          console.log('Error creating SQLite database:', (e as Error).message);
          console.log('Trying fallback approach...');
          // Fallback: create an empty file
          try {
            fs.writeFileSync(absDb, '');
            console.log('Empty file created as fallback');
          } catch (fallbackError) {
            console.log('Fallback also failed:', (fallbackError as Error).message);
          }
        }
      } else {
        console.log('Database file exists');
      }
      
      // DEBUG: Check file permissions, ownership, and details BEFORE database connection
      console.log('=== FILE PERMISSIONS DEBUG ===');
      try {
        const stats = fs.statSync(absDb);
        console.log('Database file stats:');
        console.log('  - Size:', stats.size, 'bytes');
        console.log('  - Mode:', stats.mode.toString(8));
        console.log('  - UID:', stats.uid);
        console.log('  - GID:', stats.gid);
        console.log('  - Created:', stats.birthtime);
        console.log('  - Modified:', stats.mtime);
        
        // Check if we can read the file
        try {
          const fd = fs.openSync(absDb, 'r');
          console.log('  - Can read file: YES');
          fs.closeSync(fd);
        } catch (e) {
          console.log('  - Can read file: NO -', (e as Error).message);
        }
        
        // Check if we can write to the file
        try {
          const fd = fs.openSync(absDb, 'r+');
          console.log('  - Can write to file: YES');
          fs.closeSync(fd);
        } catch (e) {
          console.log('  - Can write to file: NO -', (e as Error).message);
        }
        
        // Check file permissions in human-readable format
        const mode = stats.mode;
        const isReadable = (mode & fs.constants.R_OK) !== 0;
        const isWritable = (mode & fs.constants.W_OK) !== 0;
        const isExecutable = (mode & fs.constants.X_OK) !== 0;
        
        console.log('  - Permissions:');
        console.log('    Read:', isReadable ? 'YES' : 'NO');
        console.log('    Write:', isWritable ? 'YES' : 'NO');
        console.log('    Execute:', isExecutable ? 'YES' : 'NO');
        
      } catch (e) {
        console.log('Error getting file stats:', (e as Error).message);
      }
      
      // Check current user info
      try {
        const uid = execSync('id', { stdio: 'pipe' }).toString().trim();
        console.log('Current user info:', uid);
      } catch (e) {
        console.log('Could not get user info:', (e as Error).message);
      }
      
      // Check directory permissions
      try {
        const dirStats = fs.statSync(dataDir);
        console.log('Data directory permissions:', dirStats.mode.toString(8));
        console.log('Data directory owner - UID:', dirStats.uid, 'GID:', dirStats.gid);
      } catch (e) {
        console.log('Error getting directory stats:', (e as Error).message);
      }
      
      console.log('=== END FILE PERMISSIONS DEBUG ===');
    }
    
    // Test database connection
    console.log('Attempting to connect to database...');
    await prisma.$connect();
    console.log('Database connection successful');
    
    // DEBUG: Check what tables exist in the database
    console.log('=== DATABASE SCHEMA DEBUG ===');
    try {
      const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
      console.log('Existing tables in database:', tables);
    } catch (e) {
      console.log('Could not query existing tables:', (e as Error).message);
    }
    console.log('=== END DATABASE SCHEMA DEBUG ===');
    
    // Run Prisma migrations to create the database schema
    console.log('Running Prisma migrations...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'pipe' });
      console.log('Prisma migrations completed successfully');
    } catch (e) {
      console.log('Prisma migrations failed:', (e as Error).message);
      console.log('Trying to generate schema from Prisma...');
      try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'pipe' });
        console.log('Database schema pushed successfully');
      } catch (pushError) {
        console.log('Database push also failed:', (pushError as Error).message);
        console.log('Continuing with database initialization...');
      }
    }
    
    // Create default settings if they don't exist
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      console.log('Creating default settings...');
      await prisma.settings.create({
        data: {
          allowRegistration: true
        }
      });
      console.log('Default settings created');
    }
    
    // Create default admin user if no users exist
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('Creating default admin user...');
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('admin123', 10);
      
      await prisma.user.create({
        data: {
          email: 'admin@promptvault.local',
          password: hashedPassword,
          name: 'Admin',
          role: 'ADMIN'
        }
      });
          console.log('Default admin user created (admin@promptvault.local / admin123)');
  }
  
  // Apply FTS5 setup AFTER database initialization is complete
  console.log('Setting up FTS5 for full-text search...');
  try {
    const dbUrl = process.env.DATABASE_URL || "file:/app/backend/data/promptvault.db";
    if (dbUrl.startsWith("file:")) {
      const sqlitePath = dbUrl.replace("file:", "");
      const absDb = path.resolve(process.cwd(), sqlitePath);
      const ftsSql = path.resolve(process.cwd(), "../scripts/sql/fts5.sql");
      console.log('FTS5 database path:', absDb);
      console.log('FTS5 SQL file:', ftsSql);
      applyFtsIfNeeded(absDb, ftsSql);
      console.log('FTS5 setup completed successfully');
    }
  } catch (error) {
    console.warn('FTS5 setup failed (this is not critical):', error);
  }
  
  console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization failed:', error);
    console.error('Container will continue running for debugging purposes...');
    // Temporarily disabled: process.exit(1);
    
    // Try to start server anyway for debugging
    try {
      app.listen(port, () => console.log(`Backend listening on :${port} (DEBUG MODE - DB may not work)`));
    } catch (serverError) {
      console.error('Failed to start server:', serverError);
      // Keep container alive for debugging
      setInterval(() => {
        console.log('Container alive for debugging...');
      }, 30000);
    }
  }
}

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
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
console.log('Frontend dist path:', frontendDist);
console.log('Frontend dist exists:', fs.existsSync(frontendDist));

if (fs.existsSync(frontendDist)) {
  console.log('Serving frontend from:', frontendDist);
  // Serve static files from frontend/dist
  app.use(express.static(frontendDist));
} else {
  console.log('Frontend dist not found at:', frontendDist);
}

// API routes (registered BEFORE frontend routes)
app.use("/auth", authRoutes);
app.use("/prompts", promptsRoutes);
app.use("/search", searchRoutes);
app.use("/ratings", ratingsRoutes);
app.use("/share", shareRoutes);
app.use("/import-export", importExportRoutes);
app.use("/tags", tagsRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", adminTeamsRoutes);

// SPA-Fallback NUR für GET und NUR für "echte" FE-Routen (keine Dateien)
const apiPrefixes = [
  'auth', 'prompts', 'search', 'ratings', 'share', 'import-export',
  'tags', 'admin', 'health', 'settings'
];

// Regex: ^/(auth|prompts|...)(/|$) - mit Wortgrenze
const apiRe = new RegExp(`^/(?:${
  apiPrefixes.map(p => p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')
})(?:/|$)`);

if (fs.existsSync(frontendDist)) {
  app.get('*', (req, res, next) => {
    // a) Wenn API-Prefix => nicht hijacken
    if (apiRe.test(req.path)) return next();

    // b) Wenn es nach einer Datei aussieht (hat einen Punkt) => nicht hijacken
    if (req.path.includes('.')) return next();

    // c) Nur HTML akzeptieren
    if (!req.accepts('html')) return next();

    // d) SPA-Fallback: index.html servieren
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 404-Handler (für nicht gefundene API/Assets)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const port = Number(process.env.PORT || 3000);
console.log('Environment PORT:', process.env.PORT);
console.log('Using port:', port);

// IMPORTANT: For Docker deployment, always use port 3000 internally
const containerPort = 3000;
console.log('Container will listen on port:', containerPort);

// FTS5 setup will be applied AFTER database initialization

// Start server after database initialization
initializeDatabase().then(() => {
  app.listen(containerPort, () => console.log(`Backend listening on :${containerPort}`));
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});


