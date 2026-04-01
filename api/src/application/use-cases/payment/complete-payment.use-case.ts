/**
 * Complete Payment Use Case
 * Mock payment completion (in real app, integrate with Stripe API)
 */

import { PaymentEntity } from '../../../domain/entities/payment.entity';
import type { Payment } from '../../../domain/entities/payment.entity';
import type { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';

export interface CompletePaymentRequest {
  paymentId: number;
}

export interface CompletePaymentResponse {
  success: boolean;
  payment?: Payment;
  error?: string;
}

export class CompletePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: CompletePaymentRequest): Promise<CompletePaymentResponse> {
    try {
      // 1. Find payment
      const payment = await this.paymentRepository.findById(request.paymentId);
      if (!payment) {
        return { success: false, error: 'ไม่พบ Payment' };
      }

      // 2. Check if already completed
      if (payment.status) {
        return { success: false, error: 'Payment นี้ได้รับการยืนยันแล้ว' };
      }

      // 3. Update payment status
      const updatedPayment = await this.paymentRepository.updateStatus(request.paymentId, true);
      if (!updatedPayment) {
        return { success: false, error: 'ไม่สามารถอัปเดต Payment ได้' };
      }

      // 4. In real app, integrate with Stripe here
      // const stripePaymentIntent = await stripe.paymentIntents.confirm(...);

      return { success: true, payment: updatedPayment };
    } catch (error) {
      console.error('CompletePaymentUseCase error:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการยืนยัน Payment' };
    }
  }
}
