/**
 * User Repository Interface (Port)
 */

import type { User } from '../entities/user.entity';

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt'>>;

export interface IUserRepository {
  /**
   * สร้าง User ใหม่
   */
  create(data: CreateUserInput): Promise<User>;

  /**
   * ค้นหา User ด้วย ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * ค้นหา User ด้วย Email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * ค้นหา User ด้วย Phone
   */
  findByPhone(phone: string): Promise<User | null>;

  /**
   * อัปเดตข้อมูล User
   */
  update(id: string, data: UpdateUserInput): Promise<User | null>;

  /**
   * อัปเดต OTP และ exp_otp
   */
  updateOtp(id: string, otp: string, expOtp: Date): Promise<User | null>;

  /**
   * อัปเดต Token
   */
  updateToken(id: string, token: string): Promise<User | null>;

  /**
   * อัปเดต expiration date (exp, exp_korpor)
   */
  updateExpiration(id: string, exp: Date, expKorpor?: Date): Promise<User | null>;

  /**
   * อัปเดต subjects/sheets
   */
  updateSubjectData(id: string, subjectData: { subjects: string[]; sheets: string[] }): Promise<User | null>;

  /**
   * Soft delete User
   */
  delete(id: string): Promise<boolean>;

  /**
   * ตรวจสอบว่า Email ซ้ำหรือไม่
   */
  isEmailExists(email: string): Promise<boolean>;

  /**
   * ตรวจสอบว่า Phone ซ้ำหรือไม่
   */
  isPhoneExists(phone: string): Promise<boolean>;
}
