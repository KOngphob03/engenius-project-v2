-- Migration: Create user and payment_stripe tables
-- This is the initial schema setup
-- Table: user
CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255),
    "phone" VARCHAR NOT NULL,
    "university" VARCHAR NOT NULL,
    "department" VARCHAR NOT NULL,
    "exp" TIMESTAMP DEFAULT NOW(),
    "exp_korpor" TIMESTAMP DEFAULT NOW(),
    "exp_otp" TIMESTAMP DEFAULT NOW(),
    "subject" JSON DEFAULT '{"subjects": [], "sheets": []}',
    "role" JSON DEFAULT '["user"]',
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW(),
    "time" INTEGER DEFAULT 1800,
    "activated" BOOLEAN DEFAULT FALSE,
    "otp" VARCHAR DEFAULT '',
    "examination_fields" JSON DEFAULT '[]',
    "token" VARCHAR DEFAULT '',
    "profile" VARCHAR DEFAULT '',
    "deleted_at" TIMESTAMP
);
-- Table: payment_stripe
CREATE TABLE IF NOT EXISTS "payment_stripe" (
    "id" SERIAL PRIMARY KEY,
    "user_id" VARCHAR NOT NULL DEFAULT '',
    "username" VARCHAR NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "day" INTEGER NOT NULL,
    "subjects" JSONB NOT NULL DEFAULT '[]',
    "sheets" JSONB NOT NULL DEFAULT '[]',
    "status" BOOLEAN NOT NULL,
    "activate" BOOLEAN NOT NULL,
    "activate_code" VARCHAR NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW(),
    "deleted_at" TIMESTAMP
);
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "idx_user_phone" ON "user"("phone");
CREATE INDEX IF NOT EXISTS "idx_user_token" ON "user"("token");
CREATE INDEX IF NOT EXISTS "idx_user_deleted_at" ON "user"("deleted_at");
CREATE INDEX IF NOT EXISTS "idx_payment_user_id" ON "payment_stripe"("user_id");
CREATE INDEX IF NOT EXISTS "idx_payment_activate_code" ON "payment_stripe"("activate_code");
CREATE INDEX IF NOT EXISTS "idx_payment_status" ON "payment_stripe"("status");
CREATE INDEX IF NOT EXISTS "idx_payment_deleted_at" ON "payment_stripe"("deleted_at");