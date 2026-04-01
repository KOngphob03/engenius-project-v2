import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://admin:password1234@localhost:5433/engenius_db';

async function testConnection() {
  console.log('🔌 Testing database connection...');
  console.log('📡 Database URL:', DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

  const client = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  try {
    const result = await client`SELECT NOW() as current_time, version() as postgres_version`;
    console.log('✅ Connection successful!');
    console.log('⏰ Current time:', result[0].current_time);
    console.log('📦 PostgreSQL version:', result[0].postgres_version);

    // Test table list
    const tables = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log('📋 Tables in database:', tables.map(t => t.table_name));

  } catch (error) {
    console.error('❌ Connection failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

testConnection();
