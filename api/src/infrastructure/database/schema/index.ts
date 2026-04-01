/**
 * Drizzle Schema Definitions
 * Table: user, payment_stripe
 */

import { pgTable, uuid, varchar, boolean, timestamp, integer, json, text } from 'drizzle-orm/pg-core';

/**
 * Table: user
 */
export const userTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstname: varchar('firstname', { length: 255 }).notNull(),
  lastname: varchar('lastname', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  university: varchar('university', { length: 255 }).notNull(),
  department: varchar('department', { length: 255 }).notNull(),
  exp: timestamp('exp').defaultNow(),
  exp_korpor: timestamp('exp_korpor').defaultNow(),
  exp_otp: timestamp('exp_otp').defaultNow(),
  subject: json('subject').$type<{ subjects: string[]; sheets: string[] }>().default({ subjects: [], sheets: [] }),
  role: json('role').$type<string[]>().default(['user']),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  time: integer('time').default(1800),
  activated: boolean('activated').default(false),
  otp: varchar('otp', { length: 10 }).default(''),
  examinationFields: json('examination_fields').$type<Array<{ id: string; name: string }>>().default([]),
  token: varchar('token').default(''),
  profile: varchar('profile').default(''),
  deletedAt: timestamp('deleted_at'),
});

/**
 * Table: payment_stripe
 * Note: user_id is VARCHAR but actually references user.id (UUID)
 */
export const paymentStripeTable = pgTable('payment_stripe', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id', { length: 255 }).notNull().default(''),
  username: varchar('username', { length: 255 }).notNull(),
  price: varchar('price', { length: 10 }).notNull(), // DECIMAL(10, 2) stored as string
  day: integer('day').notNull(),
  subjects: json('subjects').$type<string[]>().default([]),
  sheets: json('sheets').$type<string[]>().default([]),
  status: boolean('status').notNull(),
  activate: boolean('activate').notNull(),
  activateCode: varchar('activate_code', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

/**
 * Type exports for use in repositories
 */
export type UserRow = typeof userTable.$inferSelect;
export type NewUserRow = typeof userTable.$inferInsert;
export type PaymentRow = typeof paymentStripeTable.$inferSelect;
export type NewPaymentRow = typeof paymentStripeTable.$inferInsert;
