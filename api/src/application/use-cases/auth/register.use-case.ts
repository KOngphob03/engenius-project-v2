/**
 * Register Use Case
 */

import bcrypt from 'bcrypt';
import { UserEntity, type User } from '../../../domain/entities/user.entity';
import { AuthEntity, type RegisterData, type AuthResponse } from '../../../domain/entities/auth.entity';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: RegisterData): Promise<AuthResponse> {
    try {
      // 1. Validate input
      const validation = AuthEntity.validateRegisterData(data);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // 2. Check duplicate email
      const emailExists = await this.userRepository.isEmailExists(data.email);
      if (emailExists) {
        return { success: false, error: 'อีเมลนี้มีอยู่ในระบบแล้ว' };
      }

      // 3. Check duplicate phone
      const phoneExists = await this.userRepository.isPhoneExists(data.phone);
      if (phoneExists) {
        return { success: false, error: 'เบอร์โทรศัพท์นี้มีอยู่ในระบบแล้ว' };
      }

      // 4. Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // 5. Create user
      const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        university: data.university,
        department: data.department,
        exp: new Date(),
        exp_korpor: new Date(),
        exp_otp: new Date(),
        subject: { subjects: [], sheets: [] },
        role: ['user'],
        createdAt: new Date(),
        updatedAt: new Date(),
        time: 1800,
        activated: false,
        otp: '',
        examinationFields: [],
        token: '',
        profile: '',
      };

      const user = await this.userRepository.create(newUser);

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
      console.error('RegisterUseCase error:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการลงทะเบียน' };
    }
  }
}
