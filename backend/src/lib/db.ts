import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

// This helper is only for running raw SQL once for FTS5 setup when using SQLite directly.
// Prisma does not manage virtual tables, so we bootstrap them here.

export function applyFtsIfNeeded(sqlitePath: string, sqlFilePath: string) {
  try {
    if (!fs.existsSync(sqlFilePath)) return;
    const db = new Database(sqlitePath);
    // V2 includes stable prompt id (pid) column and updated triggers
    const marker = "FTS_APPLIED_V2";
    db.exec("CREATE TABLE IF NOT EXISTS _meta(key TEXT PRIMARY KEY, value TEXT);");
    const row = db.prepare("SELECT value FROM _meta WHERE key = ?").get(marker) as { value?: string } | undefined;
    if (!row) {
      // drop old table if present
      db.exec("DROP TABLE IF EXISTS PromptSearch;");
      const sql = fs.readFileSync(sqlFilePath, "utf8");
      db.exec(sql);
      db.prepare("INSERT INTO _meta(key, value) VALUES(?, ?)").run(marker, new Date().toISOString());
    }
    db.close();
  } catch {
    // Silently ignore; FTS5 might not be available in some environments
  }
}


