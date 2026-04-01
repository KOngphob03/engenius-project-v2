/**
 * Activate Membership Use Case
 */

import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { UserEntity } from '../../../domain/entities/user.entity';
import type { User } from '../../../domain/entities/user.entity';
import type { Payment } from '../../../domain/entities/payment.entity';
import type { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

export interface ActivateMembershipRequest {
  activateCode: string;
}

export interface ActivateMembershipResponse {
  success: boolean;
  user?: User;
  payment?: Payment;
  error?: string;
}

export class ActivateMembershipUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: ActivateMembershipRequest): Promise<ActivateMembershipResponse> {
    try {
      // 1. Validate activate code
      if (!request.activateCode || !PaymentEntity.validateActivateCode(request.activateCode)) {
        return { success: false, error: 'รูปแบบ Activate Code ไม่ถูกต้อง' };
      }

      // 2. Find payment by activate code
      const payment = await this.paymentRepository.findByActivateCode(request.activateCode);
      if (!payment) {
        return { success: false, error: 'ไม่พบ Activate Code นี้ในระบบ' };
      }

      // 3. Check if payment is completed
      if (!payment.status) {
        return { success: false, error: 'Payment ยังไม่ได้ชำระเงิน' };
      }

      // 4. Check if already activated
      if (payment.activate) {
        return { success: false, error: 'Activate Code นี้ถูกใช้งานแล้ว' };
      }

      // 5. Check if payment is expired
      if (PaymentEntity.isExpired(payment)) {
        return { success: false, error: 'Activate Code หมดอายุแล้ว (30 วัน)' };
      }

      // 6. Find user
      const user = await this.userRepository.findById(payment.userId);
      if (!user) {
        return { success: false, error: 'ไม่พบผู้ใช้ในระบบ' };
      }

      // 7. Calculate new expiration date
      const currentExp = user.exp > new Date() ? user.exp : new Date();
      const newExp = new Date(currentExp);
      newExp.setDate(newExp.getDate() + payment.day);

      const newExpKorpor = new Date(newExp); // Same as exp for now

      // 8. Update user expiration and subjects/sheets
      await this.userRepository.updateExpiration(user.id, newExp, newExpKorpor);

      // Add subjects and sheets to user's existing data
      const updatedSubjects = [...new Set([...user.subject.subjects, ...payment.data.subjects])];
      const updatedSheets = [...new Set([...user.subject.sheets, ...payment.data.sheets])];
      await this.userRepository.updateSubjectData(user.id, {
        subjects: updatedSubjects,
        sheets: updatedSheets,
      });

      // 9. Update user activated status
      const updatedUser = await this.userRepository.update(user.id, { activated: true });

      // 10. Update payment activate status
      const updatedPayment = await this.paymentRepository.updateActivate(payment.id, true);

      return {
        success: true,
        user: updatedUser,
        payment: updatedPayment,
      };
    } catch (error) {
      console.error('ActivateMembershipUseCase error:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการเปิดใช้งานสมาชิก' };
    }
  }
}
