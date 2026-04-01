/**
 * Database Connection
 * Single instance of Drizzle client
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://admin:password1234@localhost:5433/engenius_db';

// Create connection
const client = postgres(connectionString);

// Create Drizzle instance
export const db = drizzle(client);

/**
 * Graceful shutdown
 */
export async function closeConnection() {
  await client.end();
}
