
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHmac,
} from 'node:crypto';

let db: DatabaseSync | null = null;

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'chemistrypro.sqlite');

function initializeDatabase(): DatabaseSync {
  if (db) return db;

  fs.mkdirSync(dataDir, { recursive: true });

  const connection = new DatabaseSync(dbPath);

  // Allow SQLite to wait when another process is using the database.
  connection.exec('PRAGMA busy_timeout = 10000');
  connection.exec('PRAGMA journal_mode = WAL');
  connection.exec('PRAGMA foreign_keys = ON');

  connection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      grade TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exam_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      academic_year TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS mistakes (
      id TEXT PRIMARY KEY,
      attempt_id TEXT,
      user_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      grade TEXT,
      topic TEXT NOT NULL,
      question TEXT NOT NULL,
      wrong_answer TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      date TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      note TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      grade TEXT NOT NULL,
      description TEXT,
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS video_views (
      id TEXT PRIMARY KEY,
      video_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      viewed_at TEXT NOT NULL,
      FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    DROP INDEX IF EXISTS video_views_once_per_student;

    CREATE INDEX IF NOT EXISTS video_views_video_user
    ON video_views(video_id, user_id);
  `);

  // Safe database migrations.
  const migrations = [
    'avatar_url TEXT',
    'education_type TEXT',
    'guardian_phone TEXT',
    'age INTEGER',
    'governorate TEXT',
    'city TEXT',
  ];

  const existingColumns = connection
    .prepare('PRAGMA table_info(users)')
    .all() as { name: string }[];

  for (const column of migrations) {
    const columnName = column.split(' ')[0];

    if (!existingColumns.some((item) => item.name === columnName)) {
      try {
        connection.exec(`ALTER TABLE users ADD COLUMN ${column}`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);

        if (!message.toLowerCase().includes('duplicate column')) {
          throw error;
        }
      }
    }
  }

  // Create the default administrator only if the email does not exist.
  const adminEmail = (
    process.env.ADMIN_EMAIL || 'admin@chemistrypro.local'
  ).toLowerCase();

  const adminPassword =
    process.env.ADMIN_PASSWORD || 'ChangeMe-2026!';

  connection.prepare(`
    INSERT OR IGNORE INTO users
    (id, name, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'admin-' + randomBytes(8).toString('hex'),
    'مدير المنصة',
    adminEmail,
    hashPassword(adminPassword),
    'admin',
    new Date().toISOString()
  );

  db = connection;
  return connection;
}

export function getDb(): DatabaseSync {
  return initializeDatabase();
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');

  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(
  password: string,
  stored: string
): boolean {
  const [salt, hash] = stored.split(':');

  if (!salt || !hash) return false;

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');

  return (
    actual.length === expected.length &&
    timingSafeEqual(actual, expected)
  );
}

const secret =
  process.env.SESSION_SECRET ||
  'development-only-change-this-secret-before-deploying-please';

export function createSession(user: {
  id: string;
  role: string;
  email: string;
  name: string;
}): string {
  const payload = Buffer.from(
    JSON.stringify({
      ...user,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  ).toString('base64url');

  const signature = createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');

  return `${payload}.${signature}`;
}

export function readSession(token?: string | null) {
  try {
    if (!token) return null;

    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expected = createHmac('sha256', secret)
      .update(payload)
      .digest();

    const actual = Buffer.from(signature, 'base64url');

    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      return null;
    }

    const data = JSON.parse(
      Buffer.from(payload, 'base64url').toString()
    );

    if (data.exp < Date.now()) return null;

    return data as {
      id: string;
      role: string;
      email: string;
      name: string;
      exp: number;
    };
  } catch {
    return null;
  }
}
