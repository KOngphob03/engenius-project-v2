/**
 * Payment Repository Interface (Port)
 */

import type { PaymentStripe } from '../entities/payment.entity';

export type CreatePaymentInput = Omit<PaymentStripe, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePaymentInput = Partial<Omit<PaymentStripe, 'id' | 'createdAt'>>;

export interface IPaymentRepository {
  /**
   * สร้าง Payment ใหม่
   */
  create(data: CreatePaymentInput): Promise<PaymentStripe>;

  /**
   * ค้นหา Payment ด้วย ID
   */
  findById(id: number): Promise<PaymentStripe | null>;

  /**
   * ค้นหา Payment ด้วย User ID
   */
  findByUserId(userId: string): Promise<PaymentStripe[]>;

  /**
   * ค้นหา Payment ด้วย Activate Code
   */
  findByActivateCode(code: string): Promise<PaymentStripe | null>;

  /**
   * รายการ Payment ทั้งหมด
   */
  findAll(options?: {
    limit?: number;
    offset?: number;
    status?: boolean;
    activate?: boolean;
  }): Promise<PaymentStripe[]>;

  /**
   * อัปเดต Payment
   */
  update(id: number, data: UpdatePaymentInput): Promise<PaymentStripe | null>;

  /**
   * อัปเดต status (payment completed)
   */
  updateStatus(id: number, status: boolean): Promise<PaymentStripe | null>;

  /**
   * อัปเดต activate (membership activated)
   */
  updateActivate(id: number, activate: boolean): Promise<PaymentStripe | null>;

  /**
   * Soft delete Payment
   */
  delete(id: number): Promise<boolean>;

  /**
   * ตรวจสอบว่า Activate Code ซ้ำหรือไม่
   */
  isActivateCodeExists(code: string): Promise<boolean>;
}
