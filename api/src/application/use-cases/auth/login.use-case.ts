/**
 * Login Use Case
 */

import bcrypt from 'bcrypt';
import { AuthEntity, type LoginCredentials, type AuthResponse } from '../../../domain/entities/auth.entity';
import { UserEntity } from '../../../domain/entities/user.entity';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // 1. Validate input
      const validation = AuthEntity.validateLoginCredentials(credentials);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // 2. Find user by email
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user) {
        return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      }

      // 3. Check if user is deleted
      if (user.deletedAt) {
        return { success: false, error: 'บัญชีผู้ใช้ถูกระงับการใช้งาน' };
      }

      // 4. Verify password
      if (!user.password) {
        return { success: false, error: 'บัญชีนี้ไม่สามารถใช้รหัสผ่านเข้าสู่ระบบได้' };
      }

      const passwordMatch = await bcrypt.compare(credentials.password, user.password);
      if (!passwordMatch) {
        return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      }

      // 5. Check if user is admin
      const roles = Array.isArray(user.role) ? user.role : [user.role];
      if (!roles.includes('admin')) {
        return { success: false, error: 'ไม่มีสิทธิ์เข้าถึงระบบ' };
      }

      // 6. Generate token
      const token = AuthEntity.generateToken(user.id);
      await this.userRepository.updateToken(user.id, token);

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
      console.error('LoginUseCase error:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  }
}
