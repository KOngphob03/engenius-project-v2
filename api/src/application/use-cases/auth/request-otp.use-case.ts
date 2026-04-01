/**
 * Request OTP Use Case
 */

import { UserEntity } from '../../../domain/entities/user.entity';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

export interface RequestOTPRequest {
  email: string;
}

export interface RequestOTPResponse {
  success: boolean;
  otp?: string; // Return OTP for development (in production, send via email/SMS)
  error?: string;
}

export class RequestOTPUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: RequestOTPRequest): Promise<RequestOTPResponse> {
    try {
      // 1. Validate email
      if (!request.email || !UserEntity.validateEmail(request.email)) {
        return { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' };
      }

      // 2. Find user by email
      const user = await this.userRepository.findByEmail(request.email);
      if (!user) {
        return { success: false, error: 'ไม่พบผู้ใช้ในระบบ' };
      }

      // 3. Generate OTP
      const otp = UserEntity.generateOtp();

      // 4. Calculate OTP expiration (5 minutes)
      const expOtp = new Date();
      expOtp.setMinutes(expOtp.getMinutes() + 5);

      // 5. Update OTP in database
      await this.userRepository.updateOtp(user.id, otp, expOtp);

      // 6. In production, send OTP via email/SMS here
      // For now, return OTP for development/testing
      return {
        success: true,
        otp, // TODO: Remove in production, send via email/SMS instead
      };
    } catch (error) {
      console.error('RequestOTPUseCase error:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการขอ OTP' };
    }
  }
}
