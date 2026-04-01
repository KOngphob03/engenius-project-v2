/**
 * Better Auth Client Setup
 *
 * ไฟล์นี้สำหรับเตรียมการเชื่อมต่อกับ Better Auth สำหรับระบบ Authentication
 * ใช้ร่วมกับ Backend เพื่อจัดการ Session และ Token
 *
 * เมื่อ Backend พร้อมใช้งาน ให้แก้ไข config ตาม URL ของ Backend
 */

import { createAuthClient } from "better-auth/client"

/**
 * Better Auth Client Instance
 *
 * @description
 * สร้าง instance ของ Better Auth client สำหรับใช้งานใน Frontend
 * ปัจจุบันตั้งค่า baseURL เป็น URL เดียวกับ Frontend (สำหรับ development)
 * เมื่อมี Backend แยกต่างหาก ให้แก้ไข baseURL เป็น URL ของ Backend
 *
 * @example
 * // ตัวอย่างการใช้งาน
 * import { authClient } from "@/lib/auth-client"
 *
 * // เข้าสู่ระบบ
 * await authClient.signIn.email({
 *   email: "user@example.com",
 *   password: "password"
 * })
 *
 * // ออกจากระบบ
 * await authClient.signOut()
 *
 * // ตรวจสอบ Session
 * const session = await authClient.getSession()
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
})

/**
 * ฟังก์ชันตรวจสอบสถานะการเข้าสู่ระบบ
 *
 * @returns {Promise<boolean>} คืนค่า true ถ้าผู้ใช้เข้าสู่ระบบอยู่
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await authClient.getSession()
    return !!session.data
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

/**
 * ฟังก์ชันดึงข้อมูล Session ปัจจุบัน
 *
 * @returns {Promise<Session | null>} ข้อมูล Session หรือ null ถ้าไม่ได้เข้าสู่ระบบ
 */
export async function getCurrentSession() {
  try {
    const session = await authClient.getSession()
    return session.data || null
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

/**
 * ฟังก์ชันเข้าสู่ระบบด้วย Email และ Password
 *
 * @param email - อีเมลของผู้ใช้
 * @param password - รหัสผ่าน
 * @returns {Promise<{ success: boolean; error?: string }>} ผลลัพธ์การเข้าสู่ระบบ
 */
export async function signIn(email: string, password: string) {
  try {
    const result = await authClient.signIn.email({
      email,
      password,
    })

    if (result.error) {
      return {
        success: false,
        error: result.error.message || "เข้าสู่ระบบไม่สำเร็จ",
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
    }
  }
}

/**
 * ฟังก์ชันออกจากระบบ
 *
 * @returns {Promise<{ success: boolean; error?: string }>} ผลลัพธ์การออกจากระบบ
 */
export async function signOut() {
  try {
    await authClient.signOut()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: "เกิดข้อผิดพลาดในการออกจากระบบ",
    }
  }
}

/**
 * Type Definitions สำหรับ Session (ใช้เมื่อ Backend กำหนด Schema แล้ว)
 * สามารถแก้ไขให้ตรงกับข้อมูล User ในระบบจริง
 */
export type Session = {
  user: {
    id: string
    email: string
    name?: string
    role?: string
  }
  expiresAt: Date
}
