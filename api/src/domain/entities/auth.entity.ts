/**
 * Auth Entity
 * สำหรับระบบ Authentication และ Authorization
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  university: string;
  department: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string[];
  };
  tokens?: AuthTokens;
  error?: string;
}

export interface RequestOTPData {
  email: string;
}

/**
 * Domain Logic สำหรับ Auth
 */
export class AuthEntity {
  /**
   * ตรวจสอบความถูกต้องของ LoginCredentials
   */
  static validateLoginCredentials(credentials: LoginCredentials): { isValid: boolean; error?: string } {
    if (!credentials.email || credentials.email.trim().length === 0) {
      return { isValid: false, error: 'กรุณาระบุอีเมล' };
    }
    if (!credentials.password || credentials.password.length === 0) {
      return { isValid: false, error: 'กรุณาระบุรหัสผ่าน' };
    }
    return { isValid: true };
  }

  /**
   * ตรวจสอบความถูกต้องของ RegisterData
   */
  static validateRegisterData(data: RegisterData): { isValid: boolean; error?: string } {
    if (!data.firstname || data.firstname.trim().length === 0) {
      return { isValid: false, error: 'กรุณาระบุชื่อ' };
    }
    if (!data.lastname || data.lastname.trim().length === 0) {
      return { isValid: false, error: 'กรุณาระบุนามสกุล' };
    }
    if (!data.email || data.email.trim().length === 0) {
      return { isValid: false, error: 'กรุณาระบุอีเมล' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { isValid: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' };
    }
    if (!data.password || data.password.length < 8) {
      return { isValid: false, error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' };
    }
    if (!data.phone || data.phone.trim().length === 0) {
      return { isValid: false, error: 'กรุณาระบุเบอร์โทรศัพท์' };
    }
    if (!/^0[689]\d{8}$/.test(data.phone)) {
      return { isValid: false, error: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' };
    }
    if (!data.university || data.university.trim().length === 0) {
      return { isValid: false, error: 'กรุณาระบุมหาวิทยาลัย' };
    }
    if (!data.department || data.department.trim().length === 0) {
      return { isValid: false, error: 'กรุณาระบุสาขา' };
    }
    return { isValid: true };
  }

  /**
   * สร้าง JWT Token (mock - จริงๆ ต้องใช้ library)
   */
  static generateToken(userId: string): string {
    const payload = {
      userId,
      iat: Date.now(),
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  /**
   * ตรวจสอบ JWT Token (mock)
   */
  static verifyToken(token: string): { valid: boolean; userId?: string } {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      if (payload.exp < Date.now()) {
        return { valid: false };
      }
      return { valid: true, userId: payload.userId };
    } catch {
      return { valid: false };
    }
  }
}
