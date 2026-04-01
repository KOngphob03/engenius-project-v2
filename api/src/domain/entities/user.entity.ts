/**
 * User Entity
 * หัวใจของระบบ User
 * ห้าม Import อะไรจากภายนอก (elysia, drizzle, etc.)
 */

export type UserRole = 'user' | 'admin';

export interface ExaminationField {
  id: string;
  name: string;
}

export interface SubjectData {
  subjects: string[];
  sheets: string[];
}

export interface User {
  id: string;                    // UUID
  firstname: string;
  lastname: string;
  email: string;
  password?: string;             // hashed password
  phone: string;
  university: string;
  department: string;
  exp: Date;                     // membership expiration
  exp_korpor: Date;              // korpor expiration
  exp_otp: Date;                 // OTP expiration
  subject: SubjectData;          // { subjects: [], sheets: [] }
  role: UserRole[];              // ["user"] or ["admin"]
  createdAt: Date;
  updatedAt: Date;
  time: number;                  // 1800 (seconds)
  activated: boolean;
  otp: string;                   // OTP code
  examinationFields: ExaminationField[];
  token: string;                 // auth token
  profile: string;               // profile image URL
  deletedAt?: Date;
}

/**
 * Domain Logic สำหรับ User
 */
export class UserEntity {
  /**
   * ตรวจสอบว่า User ยังใช้งานได้หรือไม่ (membership ไม่หมดอายุ)
   */
  static isActive(user: User): boolean {
    return user.activated && user.exp > new Date();
  }

  /**
   * ตรวจสอบว่า User เป็น Admin หรือไม่
   */
  static isAdmin(user: User): boolean {
    return user.role.includes('admin');
  }

  /**
   * ตรวจสอบว่า OTP หมดอายุหรือยัง
   */
  static isOtpValid(user: User): boolean {
    return user.exp_otp > new Date();
  }

  /**
   * ตรวจสอบความถูกต้องของเบอร์โทรศัพท์ (ไทย)
   */
  static validatePhone(phone: string): boolean {
    const phonePattern = /^0[689]\d{8}$/;
    return phonePattern.test(phone);
  }

  /**
   * ตรวจสอบความถูกต้องของอีเมล
   */
  static validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  /**
   * สร้าง OTP 6 หลัก
   */
  static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * ตรวจสอบความแข็งแรงของรหัสผ่าน
   * - อย่างน้อย 8 ตัวอักษร
   * - มีตัวพิมพ์ใหญ่, พิมพ์เล็ก, และตัวเลข
   */
  static validatePasswordStrength(password: string): { isValid: boolean; error?: string } {
    if (password.length < 8) {
      return { isValid: false, error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว' };
    }
    if (!/\d/.test(password)) {
      return { isValid: false, error: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' };
    }
    return { isValid: true };
  }

  /**
   * คำนวณวันที่หมดอายุจากจำนวนวัน
   */
  static calculateExpirationDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}
