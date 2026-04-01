/**
 * User Repository Implementation
 * Implement IUserRepository using Drizzle ORM
 */

import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../connection';
import { userTable, type UserRow, type NewUserRow } from '../schema';
import type { IUserRepository, CreateUserInput, UpdateUserInput } from '../../../../domain/repositories/IUserRepository';
import type { User } from '../../../../domain/entities/user.entity';

// Helper to convert DB row to Domain entity
function toDomain(row: UserRow): User {
  return {
    id: row.id,
    firstname: row.firstname,
    lastname: row.lastname,
    email: row.email,
    password: row.password,
    phone: row.phone,
    university: row.university,
    department: row.department,
    exp: new Date(row.exp),
    exp_korpor: new Date(row.exp_korpor),
    exp_otp: new Date(row.exp_otp),
    subject: row.subject || { subjects: [], sheets: [] },
    role: row.role || ['user'],
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    time: row.time,
    activated: row.activated,
    otp: row.otp,
    examinationFields: row.examination_fields || [],
    token: row.token,
    profile: row.profile,
    deletedAt: row.deleted_at ? new Date(row.deleted_at) : undefined,
  };
}

// Helper to convert Domain entity to DB row
function toDB(data: CreateUserInput | Partial<CreateUserInput>): NewUserRow {
  return {
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    password: data.password,
    phone: data.phone,
    university: data.university,
    department: data.department,
    exp: data.exp,
    exp_korpor: data.expKorpor,
    exp_otp: data.exp_otp,
    subject: data.subject,
    role: data.role,
    created_at: data.createdAt,
    updated_at: data.updatedAt,
    time: data.time,
    activated: data.activated,
    otp: data.otp,
    examination_fields: data.examinationFields,
    token: data.token,
    profile: data.profile,
    deleted_at: data.deletedAt,
  };
}

export class UserRepository implements IUserRepository {
  async create(data: CreateUserInput): Promise<User> {
    const [row] = await db.insert(userTable).values(toDB(data)).returning();
    return toDomain(row);
  }

  async findById(id: string): Promise<User | null> {
    const [row] = await db.select().from(userTable).where(eq(userTable.id, id));
    return row ? toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await db.select().from(userTable).where(eq(userTable.email, email));
    return row ? toDomain(row) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const [row] = await db.select().from(userTable).where(eq(userTable.phone, phone));
    return row ? toDomain(row) : null;
  }

  async update(id: string, data: UpdateUserInput): Promise<User | null> {
    const [row] = await db
      .update(userTable)
      .set({ ...toDB(data), updated_at: new Date() })
      .where(eq(userTable.id, id))
      .returning();
    return row ? toDomain(row) : null;
  }

  async updateOtp(id: string, otp: string, expOtp: Date): Promise<User | null> {
    const [row] = await db
      .update(userTable)
      .set({ otp, exp_otp: expOtp, updated_at: new Date() })
      .where(eq(userTable.id, id))
      .returning();
    return row ? toDomain(row) : null;
  }

  async updateToken(id: string, token: string): Promise<User | null> {
    const [row] = await db
      .update(userTable)
      .set({ token, updated_at: new Date() })
      .where(eq(userTable.id, id))
      .returning();
    return row ? toDomain(row) : null;
  }

  async updateExpiration(id: string, exp: Date, expKorpor?: Date): Promise<User | null> {
    const updateData: Partial<NewUserRow> = { exp, updated_at: new Date() };
    if (expKorpor) {
      updateData.exp_korpor = expKorpor;
    }
    const [row] = await db
      .update(userTable)
      .set(updateData)
      .where(eq(userTable.id, id))
      .returning();
    return row ? toDomain(row) : null;
  }

  async updateSubjectData(
    id: string,
    subjectData: { subjects: string[]; sheets: string[] }
  ): Promise<User | null> {
    const [row] = await db
      .update(userTable)
      .set({ subject: subjectData, updated_at: new Date() })
      .where(eq(userTable.id, id))
      .returning();
    return row ? toDomain(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const [row] = await db
      .update(userTable)
      .set({ deleted_at: new Date() })
      .where(eq(userTable.id, id))
      .returning();
    return !!row;
  }

  async isEmailExists(email: string): Promise<boolean> {
    const [row] = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(and(eq(userTable.email, email), isNull(userTable.deletedAt)))
      .limit(1);
    return !!row;
  }

  async isPhoneExists(phone: string): Promise<boolean> {
    const [row] = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(and(eq(userTable.phone, phone), isNull(userTable.deletedAt)))
      .limit(1);
    return !!row;
  }
}
