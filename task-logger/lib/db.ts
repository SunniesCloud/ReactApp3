import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "tasks.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`);

export default db;