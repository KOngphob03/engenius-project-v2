/**
 * Payment Repository Implementation
 * Implement IPaymentRepository using Drizzle ORM
 */

import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../connection';
import { paymentStripeTable } from '../schema';
import type { IPaymentRepository, CreatePaymentInput, UpdatePaymentInput } from '../../../domain/repositories/IPaymentRepository';
import type { PaymentStripe } from '../../../domain/entities/payment.entity';

// Helper to convert DB row to Domain entity
function toDomain(row: any): PaymentStripe {
  return {
    id: row.id,
    userId: row.userId,
    username: row.username,
    price: parseFloat(row.price),
    day: row.day,
    data: {
      subjects: row.subjects || [],
      sheets: row.sheets || [],
    },
    status: row.status,
    activate: row.activate,
    activateCode: row.activateCode,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    deletedAt: row.deletedAt ? new Date(row.deletedAt) : undefined,
  };
}

// Helper to convert Domain entity to DB row
function toDB(data: CreatePaymentInput | Partial<CreatePaymentInput>): any {
  return {
    userId: data.userId,
    username: data.username,
    price: data.price.toString(),
    day: data.day,
    subjects: data.data.subjects,
    sheets: data.data.sheets,
    status: data.status,
    activate: data.activate,
    activateCode: data.activateCode,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  };
}

export class PaymentRepository implements IPaymentRepository {
  async create(data: CreatePaymentInput): Promise<PaymentStripe> {
    const [row] = await db.insert(paymentStripeTable).values(toDB(data)).returning();
    return toDomain(row);
  }

  async findById(id: number): Promise<PaymentStripe | null> {
    const [row] = await db.select().from(paymentStripeTable).where(eq(paymentStripeTable.id, id));
    return row ? toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<PaymentStripe[]> {
    const rows = await db
      .select()
      .from(paymentStripeTable)
      .where(eq(paymentStripeTable.userId, userId))
      .orderBy(desc(paymentStripeTable.createdAt));
    return rows.map(toDomain);
  }

  async findByActivateCode(code: string): Promise<PaymentStripe | null> {
    const [row] = await db
      .select()
      .from(paymentStripeTable)
      .where(eq(paymentStripeTable.activateCode, code));
    return row ? toDomain(row) : null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    status?: boolean;
    activate?: boolean;
  }): Promise<PaymentStripe[]> {
    const conditions = [];

    if (options?.status !== undefined) {
      conditions.push(eq(paymentStripeTable.status, options.status));
    }
    if (options?.activate !== undefined) {
      conditions.push(eq(paymentStripeTable.activate, options.activate));
    }

    let query = db.select().from(paymentStripeTable);

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const rows = await query
      .orderBy(desc(paymentStripeTable.createdAt))
      .limit(options?.limit || 100)
      .offset(options?.offset || 0);

    return rows.map(toDomain);
  }

  async update(id: number, data: UpdatePaymentInput): Promise<PaymentStripe | null> {
    const [row] = await db
      .update(paymentStripeTable)
      .set({ ...toDB(data as Partial<CreatePaymentInput>), updated_at: new Date() })
      .where(eq(paymentStripeTable.id, id))
      .returning();
    return row ? toDomain(row) : null;
  }

  async updateStatus(id: number, status: boolean): Promise<PaymentStripe | null> {
    const [row] = await db
      .update(paymentStripeTable)
      .set({ status, updated_at: new Date() })
      .where(eq(paymentStripeTable.id, id))
      .returning();
    return row ? toDomain(row) : null;
  }

  async updateActivate(id: number, activate: boolean): Promise<PaymentStripe | null> {
    const [row] = await db
      .update(paymentStripeTable)
      .set({ activate, updated_at: new Date() })
      .where(eq(paymentStripeTable.id, id))
      .returning();
    return row ? toDomain(row) : null;
  }

  async delete(id: number): Promise<boolean> {
    const [row] = await db
      .update(paymentStripeTable)
      .set({ deleted_at: new Date() })
      .where(eq(paymentStripeTable.id, id))
      .returning();
    return !!row;
  }

  async isActivateCodeExists(code: string): Promise<boolean> {
    const [row] = await db
      .select({ id: paymentStripeTable.id })
      .from(paymentStripeTable)
      .where(eq(paymentStripeTable.activateCode, code))
      .limit(1);
    return !!row;
  }
}
