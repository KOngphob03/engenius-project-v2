/**
 * Users Routes
 * API endpoints สำหรับจัดการข้อมูลผู้ใช้และการชำระเงิน
 */

import { Elysia, t } from 'elysia';
import { DI } from '../../../infrastructure/di';
import { db } from '../../../infrastructure/database/connection';
import { userTable, paymentStripeTable, type UserRow, type PaymentRow } from '../../../infrastructure/database/schema';
import { eq, asc, like, or } from 'drizzle-orm';
import { adminMiddleware } from '../../../infrastructure/middleware/auth.middleware';

export const usersRoutes = new Elysia({ prefix: '/users' })
  .use(adminMiddleware)
  .get('/', async ({ query, set, userId, currentUser }) => {
    try {
      const { search } = query;

      let users;

      if (search) {
        // ค้นหาตาม email หรือชื่อ
        users = await db
          .select()
          .from(userTable)
          .where(
            or(
              like(userTable.email, `%${search}%`),
              like(userTable.firstname, `%${search}%`),
              like(userTable.lastname, `%${search}%`)
            )
          )
          .orderBy(asc(userTable.createdAt));
      } else {
        // ดึง users ทั้งหมด
        users = await db
          .select()
          .from(userTable)
          .orderBy(asc(userTable.createdAt));
      }

      // แปลงข้อมูลให้เหมาะกับ frontend
      const formattedUsers = users.map((user: UserRow) => ({
        id: user.id,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        branch: user.university,
        phone: user.phone,
        role: user.role,
        activated: user.activated,
      }));

      return {
        success: true,
        users: formattedUsers,
      };
    } catch (error) {
      console.error('Users fetch error:', error);
      set.status = 500;
      return {
        success: false,
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
      };
    }
  })

  .get('/:id', async ({ params, set, userId }) => {
    try {
      const userRepository = DI.getUserRepository();
      const user = await userRepository.findById(params.id);

      if (!user) {
        set.status = 404;
        return {
          success: false,
          error: 'ไม่พบผู้ใช้',
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          phone: user.phone,
          university: user.university,
          department: user.department,
          branch: user.university,
          role: user.role,
          activated: user.activated,
        },
      };
    } catch (error) {
      console.error('User fetch error:', error);
      set.status = 500;
      return {
        success: false,
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
      };
    }
  })

  .get('/:id/payments', async ({ params, set, userId }) => {
    try {
      // ดึงรายการ payment ทั้งหมดของ user
      const payments = await db
        .select()
        .from(paymentStripeTable)
        .where(eq(paymentStripeTable.userId, params.id))
        .orderBy(asc(paymentStripeTable.createdAt));

      // แปลงข้อมูลให้เหมาะกับ frontend
      const formattedPayments = payments.map((p: PaymentRow) => ({
        id: p.id.toString(),
        paymentId: p.id.toString(),
        date: new Date(p.createdAt).toLocaleDateString('th-TH', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        }),
        time: new Date(p.createdAt).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' น.',
        amount: parseFloat(p.price),
        price: p.price,
        day: p.day,
        subjects: p.subjects || [],
        sheets: p.sheets || [],
        status: p.status,
        activate: p.activate,
        activateCode: p.activateCode,
        username: p.username,
        createdAt: p.createdAt,
      }));

      return {
        success: true,
        payments: formattedPayments,
      };
    } catch (error) {
      console.error('Payments fetch error:', error);
      set.status = 500;
      return {
        success: false,
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน',
      };
    }
  })

  .get('/:id/payments/:paymentId', async ({ params, set, userId }) => {
    try {
      // ดึงรายละเอียด payment สำหรับ invoice
      const payment = await db
        .select()
        .from(paymentStripeTable)
        .where(eq(paymentStripeTable.id, parseInt(params.paymentId)))
        .limit(1);

      if (!payment || payment.length === 0) {
        set.status = 404;
        return {
          success: false,
          error: 'ไม่พบรายการชำระเงิน',
        };
      }

      const p = payment[0];

      // ดึงข้อมูล user
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, params.id))
        .limit(1);

      const userData = user && user.length > 0 ? user[0] : null;

      return {
        success: true,
        payment: {
          id: p.id.toString(),
          date: new Date(p.createdAt).toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
          invoiceNo: `INV-${new Date(p.createdAt).getFullYear()}-${p.id.toString().padStart(4, '0')}`,
          bookNo: '1',
          amount: parseFloat(p.price),
          price: p.price,
          day: p.day,
          subjects: p.subjects || [],
          sheets: p.sheets || [],
          status: p.status,
          activate: p.activate,
          activateCode: p.activateCode,
          username: p.username,
          createdAt: p.createdAt,
          // ข้อมูล user สำหรับ invoice
          user: userData ? {
            name: `${userData.firstname} ${userData.lastname}`,
            email: userData.email,
            phone: userData.phone,
            university: userData.university,
            department: userData.department,
          } : null,
        },
      };
    } catch (error) {
      console.error('Payment fetch error:', error);
      set.status = 500;
      return {
        success: false,
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน',
      };
    }
  });
