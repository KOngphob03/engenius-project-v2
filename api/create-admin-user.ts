import { db } from './src/infrastructure/database/connection';
import { userTable } from './src/infrastructure/database/schema';
import bcrypt from 'bcrypt';

async function createAdminUser() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await db.insert(userTable).values({
    firstname: 'Admin',
    lastname: 'User',
    email: 'admin@engenius.co.th',
    password: hashedPassword,
    phone: '0801234567',
    university: 'Chulalongkorn University',
    department: 'Engineering',
    role: ['admin'],
    activated: true,
    time: 7200,
    subject: { subjects: [], sheets: [] },
  }).onConflictDoNothing();

  console.log('✅ Admin user created: admin@engenius.co.th / password123');

  // Verify
  const users = await db.select().from(userTable).where((user) => user.email === 'admin@engenius.co.th');
  console.log('Users found:', users.length);
  if (users.length > 0) {
    console.log('Email:', users[0].email);
    console.log('Password hash:', users[0].password.substring(0, 20) + '...');
  }

  await db.$client.end();
  process.exit(0);
}

createAdminUser().catch(console.error);
