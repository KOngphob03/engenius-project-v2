import { db } from './src/infrastructure/database/connection';
import { userTable } from './src/infrastructure/database/schema';
import bcrypt from 'bcrypt';

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
}).onConflictDoNothing();

console.log('✅ Admin user created: admin@engenius.co.th / password123');
process.exit(0);
