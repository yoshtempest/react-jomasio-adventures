import Database from "better-sqlite3";
import type { Statement } from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data.db");

const db: Database.Database = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    data TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

const insertUser: Statement = db.prepare(
  "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
);

const findUserByEmail: Statement = db.prepare(
  "SELECT * FROM users WHERE email = ?",
);

const findUserByUsername: Statement = db.prepare(
  "SELECT * FROM users WHERE username = ?",
);

const findUserById: Statement = db.prepare(
  "SELECT id, username, email, created_at FROM users WHERE id = ?",
);

const upsertSave: Statement = db.prepare(`
  INSERT INTO saves (user_id, data, updated_at)
  VALUES (?, ?, datetime('now'))
  ON CONFLICT(user_id) DO UPDATE SET
    data = excluded.data,
    updated_at = excluded.updated_at
`);

const getSave: Statement = db.prepare(
  "SELECT data, updated_at FROM saves WHERE user_id = ?",
);

export type UserRow = {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
};

export {
  db,
  insertUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  upsertSave,
  getSave,
};
