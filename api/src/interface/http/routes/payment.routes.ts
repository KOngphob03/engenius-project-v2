/**
 * Payment Routes
 * HTTP Interface for Payment Use Cases
 */

import { Elysia, t } from 'elysia';

import { CreatePaymentUseCase } from '../../../application/use-cases/payment/create-payment.use-case';
import { CompletePaymentUseCase } from '../../../application/use-cases/payment/complete-payment.use-case';
import { ActivateMembershipUseCase } from '../../../application/use-cases/payment/activate-membership.use-case';
import { DI } from '../../../infrastructure/di';

// Initialize Use Cases
const createPaymentUseCase = new CreatePaymentUseCase(DI.getPaymentRepository(), DI.getUserRepository());
const completePaymentUseCase = new CompletePaymentUseCase(DI.getPaymentRepository(), DI.getUserRepository());
const activateMembershipUseCase = new ActivateMembershipUseCase(DI.getPaymentRepository(), DI.getUserRepository());

export const paymentRoutes = new Elysia({ prefix: '/payments' })
  // POST /payments/create - Create new payment
  .post(
    '/create',
    async ({ body, set }) => {
      const result = await createPaymentUseCase.execute(body);

      if (!result.success) {
        set.status = 400;
        return {
          success: false,
          error: result.error,
        };
      }

      set.status = 201;
      return result;
    },
    {
      detail: {
        tags: ['Payment'],
        summary: 'Create a new payment',
        description: 'Create a new payment for membership extension',
      },
      body: t.Object({
        userId: t.String(),
        username: t.String(),
        day: t.Number({ minimum: 1 }),
        subjects: t.Optional(t.Array(t.String())),
        sheets: t.Optional(t.Array(t.String())),
      }),
      response: {
        201: t.Object({
          success: t.Boolean(),
          payment: t.Object({
            id: t.Number(),
            userId: t.String(),
            username: t.String(),
            price: t.Number(),
            day: t.Number(),
            activateCode: t.String(),
            status: t.Boolean(),
            activate: t.Boolean(),
          }),
        }),
        400: t.Object({
          success: t.Boolean(),
          error: t.String(),
        }),
      },
    }
  )

  // POST /payments/complete - Complete payment (Mock Stripe)
  .post(
    '/complete',
    async ({ body, set }) => {
      const result = await completePaymentUseCase.execute(body);

      if (!result.success) {
        set.status = 400;
        return {
          success: false,
          error: result.error,
        };
      }

      return result;
    },
    {
      detail: {
        tags: ['Payment'],
        summary: 'Complete payment',
        description: 'Mock payment completion (in real app, integrate with Stripe)',
      },
      body: t.Object({
        paymentId: t.Number(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          payment: t.Object({
            id: t.Number(),
            status: t.Boolean(),
          }),
        }),
        400: t.Object({
          success: t.Boolean(),
          error: t.String(),
        }),
      },
    }
  )

  // POST /payments/activate - Activate membership with code
  .post(
    '/activate',
    async ({ body, set }) => {
      const result = await activateMembershipUseCase.execute(body);

      if (!result.success) {
        set.status = 400;
        return {
          success: false,
          error: result.error,
        };
      }

      return result;
    },
    {
      detail: {
        tags: ['Payment'],
        summary: 'Activate membership',
        description: 'Activate membership using activation code',
      },
      body: t.Object({
        activateCode: t.String({ minLength: 6, maxLength: 6 }),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          user: t.Optional(t.Object({
            id: t.String(),
            firstname: t.String(),
            lastname: t.String(),
            email: t.String(),
            activated: t.Boolean(),
          })),
          payment: t.Optional(t.Object({
            id: t.Number(),
            userId: t.String(),
            status: t.Boolean(),
            activate: t.Boolean(),
          })),
        }),
        400: t.Object({
          success: t.Boolean(),
          error: t.String(),
        }),
      },
    }
  )

  // GET /payments/list - List all payments (for testing)
  .get(
    '/list',
    async ({ query }) => {
      const paymentRepo = DI.getPaymentRepository();
      const payments = await paymentRepo.findAll({
        limit: query.limit ? parseInt(query.limit as string) : 50,
        offset: query.offset ? parseInt(query.offset as string) : 0,
      });
      return { success: true, data: payments };
    },
    {
      detail: {
        tags: ['Payment'],
        summary: 'List all payments',
        description: 'Get list of all payments (for testing)',
      },
      query: t.Object({
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
    }
  );
