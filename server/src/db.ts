import Database from 'better-sqlite3'
import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { PublicUser } from '@tarotmind/shared'

const rawPath =
  process.env.DATABASE_PATH ?? resolve(process.cwd(), 'data', 'tarotmind.db')
const dir = dirname(rawPath)
mkdirSync(dir, { recursive: true })

const db = new Database(rawPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    google_sub TEXT NOT NULL UNIQUE,
    email TEXT,
    name TEXT,
    picture TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`)

const selectByGoogleSub = db.prepare(
  `SELECT id, google_sub, email, name, picture FROM users WHERE google_sub = ?`,
)

const selectById = db.prepare(
  `SELECT id, google_sub, email, name, picture FROM users WHERE id = ?`,
)

const insertUser = db.prepare(`
  INSERT INTO users (id, google_sub, email, name, picture, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const updateUser = db.prepare(`
  UPDATE users SET email = ?, name = ?, picture = ?, updated_at = ? WHERE id = ?
`)

function rowToPublic(row: {
  id: string
  google_sub: string
  email: string | null
  name: string | null
  picture: string | null
}): PublicUser {
  return {
    id: row.id,
    googleSub: row.google_sub,
    email: row.email,
    name: row.name,
    picture: row.picture,
  }
}

export function findUserByGoogleSub(googleSub: string): PublicUser | null {
  const row = selectByGoogleSub.get(googleSub) as
    | {
        id: string
        google_sub: string
        email: string | null
        name: string | null
        picture: string | null
      }
    | undefined
  return row ? rowToPublic(row) : null
}

export function findUserById(id: string): PublicUser | null {
  const row = selectById.get(id) as
    | {
        id: string
        google_sub: string
        email: string | null
        name: string | null
        picture: string | null
      }
    | undefined
  return row ? rowToPublic(row) : null
}

export function upsertUserFromGoogle(opts: {
  googleSub: string
  email: string | null
  name: string | null
  picture: string | null
}): PublicUser {
  const now = new Date().toISOString()
  const existing = findUserByGoogleSub(opts.googleSub)
  if (existing) {
    updateUser.run(
      opts.email,
      opts.name,
      opts.picture,
      now,
      existing.id,
    )
    return {
      ...existing,
      email: opts.email,
      name: opts.name,
      picture: opts.picture,
    }
  }
  const id = randomUUID()
  insertUser.run(
    id,
    opts.googleSub,
    opts.email,
    opts.name,
    opts.picture,
    now,
    now,
  )
  return {
    id,
    googleSub: opts.googleSub,
    email: opts.email,
    name: opts.name,
    picture: opts.picture,
  }
}
