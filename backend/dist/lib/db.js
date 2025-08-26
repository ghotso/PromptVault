"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFtsIfNeeded = applyFtsIfNeeded;
const fs_1 = __importDefault(require("fs"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
// This helper is only for running raw SQL once for FTS5 setup when using SQLite directly.
// Prisma does not manage virtual tables, so we bootstrap them here.
function applyFtsIfNeeded(sqlitePath, sqlFilePath) {
    try {
        if (!fs_1.default.existsSync(sqlFilePath))
            return;
        const db = new better_sqlite3_1.default(sqlitePath);
        // V2 includes stable prompt id (pid) column and updated triggers
        const marker = "FTS_APPLIED_V2";
        db.exec("CREATE TABLE IF NOT EXISTS _meta(key TEXT PRIMARY KEY, value TEXT);");
        const row = db.prepare("SELECT value FROM _meta WHERE key = ?").get(marker);
        if (!row) {
            // drop old table if present
            db.exec("DROP TABLE IF EXISTS PromptSearch;");
            const sql = fs_1.default.readFileSync(sqlFilePath, "utf8");
            db.exec(sql);
            db.prepare("INSERT INTO _meta(key, value) VALUES(?, ?)").run(marker, new Date().toISOString());
        }
        db.close();
    }
    catch {
        // Silently ignore; FTS5 might not be available in some environments
    }
}
