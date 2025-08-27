"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const child_process_1 = require("child_process");
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
// Initialize database and create tables
async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        console.log('Checking if Prisma client is properly initialized...');
        console.log('Current working directory:', process.cwd());
        console.log('DATABASE_URL:', process.env.DATABASE_URL);
        const dbUrl = process.env.DATABASE_URL || "file:/app/backend/data/promptvault.db";
        if (dbUrl.startsWith("file:")) {
            const sqlitePath = dbUrl.replace("file:", "");
            const absDb = path_1.default.resolve(process.cwd(), sqlitePath);
            const dataDir = path_1.default.dirname(absDb);
            console.log('Database path:', absDb);
            console.log('Data directory:', dataDir);
            console.log('Data directory exists:', fs_1.default.existsSync(dataDir));
            console.log('Database file exists:', fs_1.default.existsSync(absDb));
            try {
                const currentDirContents = fs_1.default.readdirSync(process.cwd());
                console.log('Current directory contents:', currentDirContents);
            }
            catch (e) {
                console.log('Cannot read current directory:', e.message);
            }
            if (fs_1.default.existsSync(dataDir)) {
                try {
                    const dataDirContents = fs_1.default.readdirSync(dataDir);
                    console.log('Data directory contents:', dataDirContents);
                }
                catch (e) {
                    console.log('Cannot read data directory:', e.message);
                }
            }
            if (!fs_1.default.existsSync(dataDir)) {
                console.log('Creating data directory:', dataDir);
                fs_1.default.mkdirSync(dataDir, { recursive: true });
                console.log('Data directory created successfully');
            }
            if (!fs_1.default.existsSync(absDb)) {
                console.log('Database file does not exist, creating proper SQLite database...');
                try {
                    (0, child_process_1.execSync)(`sqlite3 "${absDb}" "VACUUM;"`, { stdio: 'pipe' });
                    console.log('SQLite database file created successfully');
                }
                catch (e) {
                    console.log('Error creating SQLite database:', e.message);
                    console.log('Trying fallback approach...');
                    try {
                        fs_1.default.writeFileSync(absDb, '');
                        console.log('Empty file created as fallback');
                    }
                    catch (fallbackError) {
                        console.log('Fallback also failed:', fallbackError.message);
                    }
                }
            }
            else {
                console.log('Database file exists');
            }
            console.log('=== FILE PERMISSIONS DEBUG ===');
            try {
                const stats = fs_1.default.statSync(absDb);
                console.log('Database file stats:');
                console.log('  - Size:', stats.size, 'bytes');
                console.log('  - Mode:', stats.mode.toString(8));
                console.log('  - UID:', stats.uid);
                console.log('  - GID:', stats.gid);
                console.log('  - Created:', stats.birthtime);
                console.log('  - Modified:', stats.mtime);
                try {
                    const fd = fs_1.default.openSync(absDb, 'r');
                    console.log('  - Can read file: YES');
                    fs_1.default.closeSync(fd);
                }
                catch (e) {
                    console.log('  - Can read file: NO -', e.message);
                }
                try {
                    const fd = fs_1.default.openSync(absDb, 'r+');
                    console.log('  - Can write to file: YES');
                    fs_1.default.closeSync(fd);
                }
                catch (e) {
                    console.log('  - Can write to file: NO -', e.message);
                }
                const mode = stats.mode;
                const isReadable = (mode & fs_1.default.constants.R_OK) !== 0;
                const isWritable = (mode & fs_1.default.constants.W_OK) !== 0;
                const isExecutable = (mode & fs_1.default.constants.X_OK) !== 0;
                console.log('  - Permissions:');
                console.log('    Read:', isReadable ? 'YES' : 'NO');
                console.log('    Write:', isWritable ? 'YES' : 'NO');
                console.log('    Execute:', isExecutable ? 'YES' : 'NO');
            }
            catch (e) {
                console.log('Error getting file stats:', e.message);
            }
            try {
                const uid = (0, child_process_1.execSync)('id', { stdio: 'pipe' }).toString().trim();
                console.log('Current user info:', uid);
            }
            catch (e) {
                console.log('Could not get user info:', e.message);
            }
            try {
                const dirStats = fs_1.default.statSync(dataDir);
                console.log('Data directory permissions:', dirStats.mode.toString(8));
                console.log('Data directory owner - UID:', dirStats.uid, 'GID:', dirStats.gid);
            }
            catch (e) {
                console.log('Error getting directory stats:', e.message);
            }
            console.log('=== END FILE PERMISSIONS DEBUG ===');
        }
        console.log('Attempting to connect to database...');
        await prisma_1.prisma.$connect();
        console.log('Database connection successful');
        console.log('=== DATABASE SCHEMA DEBUG ===');
        try {
            const tables = await prisma_1.prisma.$queryRaw `SELECT name FROM sqlite_master WHERE type='table'`;
            console.log('Existing tables in database:', tables);
        }
        catch (e) {
            console.log('Could not query existing tables:', e.message);
        }
        console.log('=== END DATABASE SCHEMA DEBUG ===');
        console.log('Running Prisma migrations...');
        try {
            (0, child_process_1.execSync)('npx prisma migrate deploy', { stdio: 'pipe' });
            console.log('Prisma migrations completed successfully');
        }
        catch (e) {
            console.log('Prisma migrations failed:', e.message);
            console.log('Trying to generate schema from Prisma...');
            try {
                (0, child_process_1.execSync)('npx prisma db push --accept-data-loss', { stdio: 'pipe' });
                console.log('Database schema pushed successfully');
            }
            catch (pushError) {
                console.log('Database push also failed:', pushError.message);
                console.log('Continuing with database initialization...');
            }
        }
        const settings = await prisma_1.prisma.settings.findFirst();
        if (!settings) {
            console.log('Creating default settings...');
            await prisma_1.prisma.settings.create({
                data: {
                    allowRegistration: true
                }
            });
            console.log('Default settings created');
        }
        const userCount = await prisma_1.prisma.user.count();
        if (userCount === 0) {
            console.log('Creating default admin user...');
            const bcrypt = await Promise.resolve().then(() => __importStar(require('bcryptjs')));
            const hashedPassword = await bcrypt.default.hash('admin123', 10);
            await prisma_1.prisma.user.create({
                data: {
                    email: 'admin@promptvault.local',
                    password: hashedPassword,
                    name: 'Admin',
                    role: 'ADMIN'
                }
            });
            console.log('Default admin user created (admin@promptvault.local / admin123)');
        }
        console.log('Setting up FTS5 for full-text search...');
        try {
            const dbUrl = process.env.DATABASE_URL || "file:/app/backend/data/promptvault.db";
            if (dbUrl.startsWith("file:")) {
                const sqlitePath = dbUrl.replace("file:", "");
                const absDb = path_1.default.resolve(process.cwd(), sqlitePath);
                const ftsSql = path_1.default.resolve(process.cwd(), "../scripts/sql/fts5.sql");
                console.log('FTS5 database path:', absDb);
                console.log('FTS5 SQL file:', ftsSql);
                (0, db_1.applyFtsIfNeeded)(absDb, ftsSql);
                console.log('FTS5 setup completed successfully');
            }
        }
        catch (error) {
            console.warn('FTS5 setup failed (this is not critical):', error);
        }
        console.log('Database initialization complete');
    }
    catch (error) {
        console.error('Database initialization failed:', error);
        console.error('Container will continue running for debugging purposes...');
        try {
            app.listen(port, () => console.log(`Backend listening on :${port} (DEBUG MODE - DB may not work)`));
        }
        catch (serverError) {
            console.error('Failed to start server:', serverError);
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
        const settings = await prisma_1.prisma.settings.findFirst();
        if (settings) {
            res.json({ allowRegistration: settings.allowRegistration });
        }
        else {
            res.json({ allowRegistration: true });
        }
    }
    catch (error) {
        console.error('Failed to fetch public settings:', error);
        res.json({ allowRegistration: true });
    }
});
// Serve frontend static files BEFORE API routes
const frontendDist = path_1.default.resolve(__dirname, "../../frontend/dist");
console.log('Frontend dist path:', frontendDist);
console.log('Frontend dist exists:', fs_1.default.existsSync(frontendDist));
if (fs_1.default.existsSync(frontendDist)) {
    console.log('Serving frontend from:', frontendDist);
    app.use(express_1.default.static(frontendDist));
}
else {
    console.log('Frontend dist not found at:', frontendDist);
}
// API routes (registered BEFORE frontend routes) - now under /api prefix
app.use("/api/auth", auth_1.default);
app.use("/api/prompts", prompts_1.default);
app.use("/api/search", search_1.default);
app.use("/api/ratings", ratings_1.default);
app.use("/api/share", share_1.default);
app.use("/api/import-export", importExport_1.default);
app.use("/api/tags", tags_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/admin", adminTeams_1.default);
// SPA-Fallback: Serve index.html for all non-API routes
if (fs_1.default.existsSync(frontendDist)) {
    // Express 5 compatible SPA fallback - use specific route patterns
    app.get(['/', '/prompts', '/prompts/:id', '/search', '/about', '/account', '/admin', '/teams', '/teams/:id'], (req, res) => {
        res.sendFile(path_1.default.join(frontendDist, 'index.html'));
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
// Start server after database initialization
initializeDatabase().then(() => {
    app.listen(containerPort, () => console.log(`Backend listening on :${containerPort}`));
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
