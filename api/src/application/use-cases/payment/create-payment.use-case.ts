/**
 * Create Payment Use Case
 */

import { PaymentEntity, type PaymentStripe, type PaymentData } from '../../../domain/entities/payment.entity';
import { UserEntity } from '../../../domain/entities/user.entity';
import type { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

export interface CreatePaymentRequest {
  userId: string;
  username: string;
  day: number;
  subjects: string[];
  sheets: string[];
}

export interface CreatePaymentResponse {
  success: boolean;
  payment?: PaymentStripe;
  error?: string;
}

export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      // 1. Validate input
      if (!request.userId || request.userId.trim().length === 0) {
        return { success: false, error: 'กรุณาระบุ User ID' };
      }
      if (!request.username || request.username.trim().length === 0) {
        return { success: false, error: 'กรุณาระบุชื่อผู้ใช้' };
      }
      if (request.day <= 0) {
        return { success: false, error: 'จำนวนวันต้องมากกว่า 0' };
      }

      // 2. Check if user exists
      const user = await this.userRepository.findById(request.userId);
      if (!user) {
        return { success: false, error: 'ไม่พบผู้ใช้ในระบบ' };
      }

      // 3. Calculate price
      const price = PaymentEntity.calculatePrice(request.day);

      // 4. Generate activate code
      let activateCode = PaymentEntity.generateActivateCode();
      // Ensure unique activate code
      while (await this.paymentRepository.isActivateCodeExists(activateCode)) {
        activateCode = PaymentEntity.generateActivateCode();
      }

      // 5. Create payment
      const paymentData: Omit<PaymentStripe, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: request.userId,
        username: request.username,
        price,
        day: request.day,
        data: {
          subjects: request.subjects || [],
          sheets: request.sheets || [],
        },
        status: false, // payment not completed yet
        activate: false, // not activated yet
        activateCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const payment = await this.paymentRepository.create(paymentData);

      return { success: true, payment };
    } catch (error) {
      console.error('CreatePaymentUseCase error:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการสร้าง Payment' };
    }
  }
}
