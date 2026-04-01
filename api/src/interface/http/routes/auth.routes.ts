/**
 * Auth Routes
 * HTTP Interface for Auth Use Cases
 */

import { Elysia, t } from 'elysia';
import { openapi } from '@elysiajs/openapi';

import { RegisterUseCase } from '../../../application/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case';
import { RequestOTPUseCase } from '../../../application/use-cases/auth/request-otp.use-case';
import { VerifyOTPUseCase } from '../../../application/use-cases/auth/verify-otp.use-case';
import { DI } from '../../../infrastructure/di';

// Initialize Use Cases
const registerUseCase = new RegisterUseCase(DI.getUserRepository());
const loginUseCase = new LoginUseCase(DI.getUserRepository());
const requestOTPUseCase = new RequestOTPUseCase(DI.getUserRepository());
const verifyOTPUseCase = new VerifyOTPUseCase(DI.getUserRepository());

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(openapi({
    path: '/openapi',
    documentation: {
      info: {
        title: 'Engenius Auth API',
        version: '1.0.0',
        description: 'Authentication API for Engenius',
      },
    },
  }))

  // POST /auth/register - Register new user
  .post(
    '/register',
    async ({ body, set }) => {
      const result = await registerUseCase.execute(body);

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
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Create a new user account',
      },
      body: t.Object({
        firstname: t.String({ minLength: 1 }),
        lastname: t.String({ minLength: 1 }),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
        phone: t.String({ pattern: '^0[689]\\d{8}$' }),
        university: t.String({ minLength: 1 }),
        department: t.String({ minLength: 1 }),
      }),
      response: {
        201: t.Object({
          success: t.Boolean(),
          user: t.Object({
            id: t.String(),
            firstname: t.String(),
            lastname: t.String(),
            email: t.String(),
            role: t.Array(t.String()),
          }),
          tokens: t.Object({
            accessToken: t.String(),
            expiresIn: t.Number(),
          }),
        }),
        400: t.Object({
          success: t.Boolean(),
          error: t.String(),
        }),
      },
    }
  )

  //Method GET Login
  .get(
    '/login',
    async ({ query, set }) => { // เปลี่ยนจาก body เป็น query
      const result = await loginUseCase.execute(query); 
      if (!result.success) {
        set.status = 401;
        return {
          success: false,
          error: result.error,
        };
      }
      return result;
    },
    {
      query: t.Object({ // เปลี่ยนจาก body เป็น query
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          user: t.Object({
            id: t.String(),
            firstname: t.String(),
            lastname: t.String(),
            email: t.String(),
            role: t.Array(t.String()),
          }),
          tokens: t.Object({
            accessToken: t.String(),
            expiresIn: t.Number(),
          }),
        }),
        401: t.Object({
          success: t.Boolean(),
          error: t.String(),
        }),
      },
    }
  )
  
    

  // POST /auth/login - Login with email and password
  .post(
    '/login',
    async ({ body, set }) => {
      const result = await loginUseCase.execute(body);

      if (!result.success) {
        set.status = 401;
        return {
          success: false,
          error: result.error,
        };
      }

      return result;
    },
    {
      detail: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        description: 'Authenticate user and return access token',
      },
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          user: t.Object({
            id: t.String(),
            firstname: t.String(),
            lastname: t.String(),
            email: t.String(),
            role: t.Array(t.String()),
          }),
          tokens: t.Object({
            accessToken: t.String(),
            expiresIn: t.Number(),
          }),
        }),
        401: t.Object({
          success: t.Boolean(),
          error: t.String(),
        }),
      },
    }
  )

  // POST /auth/request-otp - Request OTP code
  .post(
    '/request-otp',
    async ({ body, set }) => {
      const result = await requestOTPUseCase.execute(body);

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
        tags: ['Auth'],
        summary: 'Request OTP code',
        description: 'Send OTP code to user email (Development: returns OTP in response)',
      },
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          otp: t.Optional(t.String()), // Only in development
        }),
        400: t.Object({
          success: t.Boolean(),
          error: t.String(),
        }),
      },
    }
  )

  // POST /auth/verify-otp - Verify OTP code
  .post(
    '/verify-otp',
    async ({ body, set }) => {
      const result = await verifyOTPUseCase.execute(body);

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
        tags: ['Auth'],
        summary: 'Verify OTP code',
        description: 'Verify OTP code and return access token',
      },
      body: t.Object({
        email: t.String({ format: 'email' }),
        otp: t.String({ minLength: 6, maxLength: 6 }),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          user: t.Object({
            id: t.String(),
            firstname: t.String(),
            lastname: t.String(),
            email: t.String(),
            role: t.Array(t.String()),
          }),
          tokens: t.Object({
            accessToken: t.String(),
            expiresIn: t.Number(),
          }),
        }),
        400: t.Object({
          success: t.Boolean(),
          error: t.String(),
        }),
      },
    }
  );
