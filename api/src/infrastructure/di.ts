/**
 * Dependency Injection Container
 * จัดการการสร้าง instances ของ Repositories
 */

import { UserRepository } from './database/repositories/UserRepository.impl';
import { PaymentRepository } from './database/repositories/PaymentRepository.impl';
import type { IUserRepository } from '../domain/repositories/IUserRepository';
import type { IPaymentRepository } from '../domain/repositories/IPaymentRepository';

// Singleton instances
let userRepository: IUserRepository | null = null;
let paymentRepository: IPaymentRepository | null = null;

export const DI = {
  getUserRepository(): IUserRepository {
    if (!userRepository) {
      userRepository = new UserRepository();
    }
    return userRepository;
  },

  getPaymentRepository(): IPaymentRepository {
    if (!paymentRepository) {
      paymentRepository = new PaymentRepository();
    }
    return paymentRepository;
  },
};
