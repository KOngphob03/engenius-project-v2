/**
 * Auth Middleware
 * ตรวจสอบ JWT token และ user authentication
 */

import { Elysia } from 'elysia';

export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .derive(async ({ headers, set }) => {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    const { AuthEntity } = await import('../../domain/entities/auth.entity.js');
    const verification = AuthEntity.verifyToken(token);

    if (!verification.valid) {
      set.status = 401;
      throw new Error('Unauthorized: Invalid token');
    }

    return {
      userId: verification.userId as string,
    };
  });

/**
 * Admin-only middleware
 * ตรวจสอบว่าผู้ใช้มี role 'admin'
 */
export const adminMiddleware = new Elysia({ name: 'admin-middleware' })
  .use(authMiddleware)
  .derive(async ({ userId, set }) => {
    const { db: database } = await import('../database/connection.js');
    const { userTable } = await import('../database/schema/index.js');
    const { eq } = await import('drizzle-orm');

    const users = await database
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!users || users.length === 0) {
      set.status = 404;
      throw new Error('User not found');
    }

    const user = users[0];
    const roles = Array.isArray(user.role) ? user.role : [user.role];

    if (!roles.includes('admin')) {
      set.status = 403;
      throw new Error('Forbidden: Admin access required');
    }

    return {
      currentUser: user,
    };
  });
