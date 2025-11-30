#!/usr/bin/env node
/*
 Simple DB seed script for SafeOps (apps/api)
 Creates two small test tables (`test_users`, `test_venues`) and inserts sample rows.
 Usage:
  - Ensure .env has a working DATABASE_URL
  - From repo root: `node apps/api/scripts/seed.js` or `cd apps/api && node scripts/seed.js`
*/

const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

// Try loading .env from several locations: package folder, repo root, and cwd
const candidates = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '..', '.env'),
  path.join(process.cwd(), '.env')
]

let loaded = false
for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p })
    console.log('Loaded env from', p)
    loaded = true
    break
  }
}
if (!loaded) {
  // fallback to default behavior (will try process.env only)
  dotenv.config()
}

const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('ERROR: DATABASE_URL not set in environment')
  process.exit(1)
}

const pool = new Pool({ connectionString })

async function run() {
  try {
    console.log('Connecting to database...')
    await pool.connect()

    console.log('Creating test tables (if not exist)...')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_venues (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT
      );
    `)

    console.log('Inserting sample rows (if not present)...')
    await pool.query(`INSERT INTO test_users (email, name) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING`, ['hello@safeops.local', 'Hello User'])
    await pool.query(`INSERT INTO test_venues (name, address) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`, ['Hello Venue', '123 Demo St'])

    const users = await pool.query('SELECT * FROM test_users')
    const venues = await pool.query('SELECT * FROM test_venues')

    console.log('=== test_users ===')
    console.table(users.rows)
    console.log('=== test_venues ===')
    console.table(venues.rows)

    console.log('Seed complete.')
  } catch (err) {
    console.error('Seed failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

run()
