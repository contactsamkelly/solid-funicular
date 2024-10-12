import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export function getDB(env) { 
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);
  return db;
}