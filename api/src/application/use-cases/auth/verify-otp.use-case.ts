/**
 * Verify OTP Use Case
 */

import { UserEntity } from '../../../domain/entities/user.entity';
import { AuthEntity } from '../../../domain/entities/auth.entity';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  user?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string[];
  };
  tokens?: {
    accessToken: string;
    expiresIn: number;
  };
  error?: string;
}

export class VerifyOTPUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      // 1. Validate input
      if (!request.email || !UserEntity.validateEmail(request.email)) {
        return { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' };
      }
      if (!request.otp || request.otp.length !== 6) {
        return { success: false, error: 'รูปแบบ OTP ไม่ถูกต้อง' };
      }

      // 2. Find user by email
      const user = await this.userRepository.findByEmail(request.email);
      if (!user) {
        return { success: false, error: 'ไม่พบผู้ใช้ในระบบ' };
      }

      // 3. Verify OTP
      if (user.otp !== request.otp) {
        return { success: false, error: 'OTP ไม่ถูกต้อง' };
      }

      // 4. Check OTP expiration
      if (!UserEntity.isOtpValid(user)) {
        return { success: false, error: 'OTP หมดอายุแล้ว' };
      }

      // 5. Check if user is admin
      const roles = Array.isArray(user.role) ? user.role : [user.role];
      if (!roles.includes('admin')) {
        return { success: false, error: 'ไม่มีสิทธิ์เข้าถึงระบบ' };
      }

      // 6. Generate token
      const token = AuthEntity.generateToken(user.id);
      await this.userRepository.updateToken(user.id, token);

      // 6. Clear OTP after successful verification
      await this.userRepository.updateOtp(user.id, '', new Date());

      return {
        success: true,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
        tokens: {
          accessToken: token,
          expiresIn: 7 * 24 * 60 * 60, // 7 days
        },
      };
    } catch (error) {
      console.error('VerifyOTPUseCase error:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการยืนยัน OTP' };
    }
  }
}
