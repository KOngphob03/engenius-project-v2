/**
 * Payment Entity
 * หัวใจของระบบ Payment Stripe
 * ห้าม Import อะไรจากภายนอก (elysia, drizzle, etc.)
 */

export interface PaymentItem {
  id: string;
  type: 'subject' | 'sheet';
  name: string;
}

export interface PaymentData {
  subjects: string[];           // subject IDs
  sheets: string[];             // sheet IDs
}

export interface PaymentStripe {
  id: number;                   // SERIAL PRIMARY KEY
  userId: string;               // VARCHAR - foreign key to user.id (UUID)
  username: string;
  price: number;                // DECIMAL(10, 2)
  day: number;                  // INTEGER - days to add to expiration
  data: PaymentData;            // subjects + sheets from JSONB
  status: boolean;              // payment completed?
  activate: boolean;            // membership activated?
  activateCode: string;         // activation code
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Domain Logic สำหรับ Payment
 */
export class PaymentEntity {
  /**
   * สร้าง Activate Code 6 หลัก
   */
  static generateActivateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * ตรวจสอบว่า activate code ถูกต้องหรือไม่ (6 หลัก)
   */
  static validateActivateCode(code: string): boolean {
    return /^\d{6}$/.test(code);
  }

  /**
   * คำนวณราคาตามจำนวนวัน
   * Business Rule: 10 บาทต่อวัน
   */
  static calculatePrice(days: number, pricePerDay: number = 10): number {
    return Math.round(days * pricePerDay * 100) / 100;
  }

  /**
   * ตรวจสอบว่า payment สามารถ activate ได้หรือไม่
   */
  static canActivate(payment: PaymentStripe): boolean {
    return payment.status && !payment.activate;
  }

  /**
   * ตรวจสอบว่า payment หมดอายุหรือยัง (30 วันจาก createdAt)
   */
  static isExpired(payment: PaymentStripe): boolean {
    const expiryDate = new Date(payment.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 30);
    return new Date() > expiryDate;
  }
}
